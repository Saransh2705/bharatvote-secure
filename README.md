# 🗳️ BharatVote

A **secure digital voting platform** for the Indian election system — voter
registration with facial verification, one-vote-per-election secure voting,
**independent vote verification**, and **real-time results**. Built with
**Next.js 15** + **Supabase**, with security and privacy enforced at the
**database layer** (Row Level Security), not just in the UI.

| | |
|---|---|
| **Frontend** | Next.js 15 (App Router) · React · TypeScript · Tailwind · shadcn/ui · Framer Motion |
| **Backend** | Next.js API routes (self-contained) **+** a standalone Express service in [`backend/`](./backend) |
| **Database** | Supabase (PostgreSQL + Row Level Security + auto REST APIs) |
| **Email** | Resend (vote confirmation) |
| **Privacy** | Voter records & ballots are reachable **only** server-side (service-role); the browser can read public data only |

---

## ✨ Features

- 🧾 **Voter registration** — EPIC (voter ID) + a 3-shot **facial capture** step.
- 🗳️ **Secure voting** — pick an active election & candidate; the vote is encoded and issued a **confirmation ID**.
- 🔒 **One vote per election** — enforced by a database `unique(election, voter)` constraint (double-voting is impossible).
- ✅ **Vote verification** — confirm a vote from its confirmation ID, without revealing the ballot.
- 📊 **Real-time results** — live bar/pie charts and candidate rankings that update as votes are cast.
- #️⃣ **Elections browser** — active / upcoming / completed, filterable.
- 📍 **Booth locator**, 📄 **documents**, and 📢 **announcements**.
- 🛡️ **Multi-level admin** — Super, EC, State, District, Constituency, Booth.

---

## 🚀 Setup

### 1. Install
```bash
cd bharatvote-secure
bun install     # or: npm install
```

### 2. Database (Supabase)
Create a Supabase project, then apply the migration in the SQL Editor (or via the
Supabase CLI) — it creates every table, RLS policy, index, **and** seed data in one step:
```
supabase/migrations/0001_init.sql
```
Tables: `users`, `elections`, `candidates`, `votes`, `booths`, `documents`, `announcements`.

### 3. Credentials
Copy the example and fill in your keys (Supabase → Project Settings → API):
```bash
cp .env.example .env.local
```
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...        # public, RLS-bound (safe in browser)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...            # SECRET — server only, bypasses RLS
RESEND_API_KEY=re_...                            # vote-confirmation email
NEXTAUTH_SECRET=<openssl rand -base64 32>
```
> `.env.local` is git-ignored — never commit secrets.

### 4. Run
```bash
bun run dev        # http://localhost:3000
```

### Scripts
`bun run dev` · `bun run build` · `bun run start` · `bun run lint`

---

## 🧱 Architecture

A three-layer, database-centric design. The **browser holds only a restricted anon
key** and can read public electoral data but cannot write or read sensitive tables.
**All writes flow through trusted server code** using the service-role key.

```
Browser (Next.js/React)  ──HTTPS──►  Next.js API routes  ──service role──►  Supabase (PostgreSQL)
   anon key (read only)                (register · vote)                     RLS · tables · seed
        └────────── public reads (elections, candidates, results) ──────────────┘
```

- **Public reference data** (`elections`, `candidates`, `booths`, `documents`, `announcements`) has a read-only RLS policy → safe to read with the anon key.
- **Sensitive tables** (`users`, `votes`) have **no anon policy** → reachable only by the server's service-role key.
- **Votes are append-only** and `unique(election, voter)` → immutable log, one vote per election.

---

## 🖥️ Backend

BharatVote ships with **two** backends against the **same** Supabase project:

### A) Built-in Next.js API routes — *default*
The app is self-contained; its `app/api/*` route handlers are the backend.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/register` | Create / return a voter |
| `POST` | `/api/vote` | Cast a vote (one per election) + tally + email |
| `GET` | `/api/vote?confirmation_id=` | Verify a vote |
| `GET` | `/api/elections?status=` | List elections |
| `GET` | `/api/candidates?election_id=` | List candidates |

### B) Standalone Express service — [`backend/`](./backend)
A separate **Express + Bun** API (useful for a mobile client or other consumers),
exposing the same operations under `/v1`:

```bash
cd backend
cp .env.example .env      # Supabase URL + anon + service-role keys
bun install
bun index.ts              # http://localhost:4000
```
| Method | Route |
|---|---|
| `GET` | `/health` |
| `GET` | `/v1/elections?status=` · `/v1/candidates?election_id=` |
| `POST` | `/v1/register` · `/v1/vote` |
| `GET` | `/v1/vote/verify?confirmation_id=` |

Both backends use the same privilege model: **anon key for public reads, service-role for writes.**

---

## 📁 Project structure

```
app/
  page.tsx                     home
  register/  vote/  results/   voter journey (register → vote → results)
  elections/  verify/  booths/  documents/  help/
  admin/login/  admin/[role]/  role-scoped administration
  api/
    register/  vote/  elections/  candidates/   Next.js server routes (service role)
lib/
  supabase.ts                  anon + service-role clients
  session.ts                   client voter session
  email.ts  mockData.ts  utils.ts
components/                     Layout, CandidateCard, ElectionCard, ui/…
supabase/migrations/0001_init.sql   schema · RLS · seed
backend/                        standalone Express API (Bun) — see backend/README.md
report/                         project report (PDF) + presentation deck (PPTX)
```

---

## 🔒 Security

Privacy and integrity are enforced by the database, so no client bug can leak data
or corrupt a tally:

- **Row Level Security** on every table; `users` and `votes` are invisible to the anon key — even a direct API call with the public key returns nothing.
- **Server-side privilege separation** — registration and voting run only in server routes with the service-role key.
- **One vote per election** — a `unique(election_id, voter_id)` constraint makes double-voting impossible.
- **Append-only ballots** — recorded votes are never updated or deleted.
- **Secrets stay server-side** — only the RLS-bound anon key ever reaches the browser.

---

## 📄 Report & presentation

A full project report and slide deck live in [`report/`](./report):

- 📄 **`BharatVote-Report.pdf`** — 50-page project report (introduction, literature review, requirements, system design with diagrams, implementation, testing, deployment, conclusion, appendices).
- 📊 **`BharatVote-Presentation.pptx`** — 17-slide presentation deck.

---

## ☁️ Deployment

Deploy the Next.js app to **Vercel** (recommended — zero-config) or any Node host
(Netlify, Railway, a container, or self-hosted). The managed Supabase backend needs
no separate deployment — the app connects to it via the environment variables above.

---

Made for a secure, transparent, and accessible democratic process. 🇮🇳
