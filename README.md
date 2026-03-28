# BharatVote - Secure Digital Voting Platform

A secure, government-grade digital voting platform built with Next.js for the Indian election system.

## Tech Stack

This project is built with:

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Smooth animations
- **Bun** - Fast JavaScript runtime and package manager

## Getting Started

### Prerequisites

- Node.js 18+ or Bun installed
- Git
- Supabase account (for database)
- Resend account (for emails)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd bharatvote-secure

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual credentials

# Start the development server
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Setup

1. **Supabase Configuration:**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key to `.env.local`
   - Get service role key from Settings > API

2. **Resend Email:**
   - Sign up at [resend.com](https://resend.com)
   - Add and verify your domain
   - Copy API key to `.env.local`

3. **NextAuth Secret:**
   - Generate a secure secret: `openssl rand -base64 32`
   - Add to `.env.local` as `NEXTAUTH_SECRET`

See `.env.example` for all available configuration options.

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Create production build
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Project Structure

```
app/              # Next.js App Router pages
components/       # Reusable React components
lib/              # Utility functions and mock data
hooks/            # Custom React hooks
public/           # Static assets
```

## Features

- Secure voter authentication with facial verification
- Real-time election results
- Multi-level admin system (Super, EC, State, District, Constituency, Booth)
- Voter registration and verification
- Booth locator with geolocation
- Document management system
- Help center and FAQs

## Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js application:

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker
