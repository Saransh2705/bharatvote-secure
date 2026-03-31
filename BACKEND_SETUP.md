# Backend Integration Guide

This document outlines the backend setup and integration for BharatVote.

## ✅ What's Been Set Up

### 1. Environment Variables
- `.env.local` - Contains your actual credentials (NOT committed to git)
- `.env.example` - Template for environment variables (safe to commit)

### 2. Installed Packages
- **@supabase/supabase-js** - Database and authentication
- **next-auth** - Authentication framework
- **resend** - Email service

### 3. Created Files
- `lib/supabase.ts` - Supabase client configuration
- `lib/email.ts` - Email templates and sending functions
- `app/api/elections/route.ts` - Elections API endpoints
- `app/api/vote/route.ts` - Voting API endpoints

## 📊 Database Setup (Supabase)

### Step 1: Create Tables

Go to your Supabase project dashboard and run these SQL commands:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  voter_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  face_data TEXT,
  role TEXT DEFAULT 'voter',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Elections table
CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_type TEXT NOT NULL,
  state TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('active', 'upcoming', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  party TEXT NOT NULL,
  party_symbol TEXT,
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  photo TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  encrypted_vote TEXT NOT NULL,
  confirmation_id TEXT UNIQUE NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, voter_id)
);

-- Booths table
CREATE TABLE booths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booth_number TEXT NOT NULL,
  address TEXT NOT NULL,
  constituency TEXT,
  district TEXT,
  state TEXT NOT NULL,
  officer TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_votes_election ON votes(election_id);
CREATE INDEX idx_votes_voter ON votes(voter_id);
CREATE INDEX idx_votes_confirmation ON votes(confirmation_id);
CREATE INDEX idx_candidates_election ON candidates(election_id);
CREATE INDEX idx_elections_status ON elections(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_voter_id ON users(voter_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow read for all authenticated users, write based on role)
CREATE POLICY "Public elections are viewable by everyone" ON elections
  FOR SELECT USING (true);

CREATE POLICY "Public candidates are viewable by everyone" ON candidates
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own votes" ON votes
  FOR SELECT USING (auth.uid() = voter_id);

CREATE POLICY "Users can cast votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Public booths are viewable by everyone" ON booths
  FOR SELECT USING (true);

CREATE POLICY "Public documents are viewable by everyone" ON documents
  FOR SELECT USING (true);

CREATE POLICY "Public announcements are viewable by everyone" ON announcements
  FOR SELECT USING (true);
```

### Step 2: Insert Sample Data

```sql
-- Insert sample elections
INSERT INTO elections (election_type, state, start_date, end_date, status) VALUES
  ('Lok Sabha Election', 'All India', '2026-04-10', '2026-05-20', 'upcoming'),
  ('State Assembly Election', 'Maharashtra', '2026-03-01', '2026-03-15', 'active'),
  ('Municipal Corporation Election', 'Delhi', '2026-03-05', '2026-03-10', 'active');

-- Insert sample candidates (replace election_id with actual IDs from above)
-- Get election IDs first:
-- SELECT id, election_type FROM elections;

-- Then insert:
-- INSERT INTO candidates (name, party, party_symbol, election_id) VALUES
--   ('Rajesh Kumar', 'National Democratic Alliance', '🪷', '<election-id>'),
--   ('Priya Sharma', 'United Progressive Front', '✋', '<election-id>');
```

## 🔐 Authentication Setup

### NextAuth Configuration

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implement your authentication logic here
        // This is a placeholder
        return null;
      }
    })
  ],
  pages: {
    signIn: '/register',
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
```

## 📧 Email Testing

To test email functionality:

1. Make sure `RESEND_API_KEY` is set in `.env.local`
2. Verify your domain in Resend dashboard
3. Test with the email functions in `lib/email.ts`

## 🔄 Next Steps

### Frontend Integration

1. **Replace mock data imports** with API calls:
   ```typescript
   // Before:
   import { elections } from '@/lib/mockData';
   
   // After:
   const response = await fetch('/api/elections');
   const { data: elections } = await response.json();
   ```

2. **Add loading and error states** to all pages

3. **Implement authentication** with NextAuth sessions

4. **Add real-time updates** with Supabase subscriptions

### Required Integrations

- [ ] Aadhaar verification API
- [ ] Face recognition service (AWS Rekognition / Azure Face)
- [ ] SMS/OTP service (MSG91 / Twilio)
- [ ] Google Maps for booth locator
- [ ] File upload for documents (Supabase Storage)

### Security Enhancements

- [ ] Implement proper vote encryption
- [ ] Add rate limiting middleware
- [ ] Set up audit logging
- [ ] Configure CORS properly
- [ ] Add request validation with Zod

## 🧪 Testing APIs

Test your APIs with:

```bash
# Get elections
curl http://localhost:3000/api/elections

# Get active elections only
curl http://localhost:3000/api/elections?status=active

# Verify a vote
curl http://localhost:3000/api/vote/verify?confirmation_id=BV-2026-ABC123
```

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Resend Documentation](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
