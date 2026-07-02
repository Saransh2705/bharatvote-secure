# BharatVote — Express Backend

A standalone **Express + Bun** API server for BharatVote, kept in the same repository
as the Next.js app. It talks to the **same Supabase project** and exposes the same
core operations as the app's built-in `/api` routes, so it can serve as an
independent backend (for example, for mobile clients or other consumers).

> The Next.js app is fully self-contained and uses its own `app/api/*` routes by
> default — this Express service is an optional, co-located alternative backend.

## Endpoints (mounted under `/v1`)

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/health` | Liveness check | — |
| GET | `/v1/elections?status=` | List elections | anon |
| GET | `/v1/candidates?election_id=` | List candidates | anon |
| POST | `/v1/register` | Create / return a voter | service role |
| POST | `/v1/vote` | Cast a vote (one per election) + tally | service role |
| GET | `/v1/vote/verify?confirmation_id=` | Verify a vote | service role |

Public reads use the **anon** key (bound by Row Level Security); all writes and
sensitive reads use the **service-role** key, which bypasses RLS — the same
privilege-separation model as the Next.js app.

## Run

```sh
cd backend
cp .env.example .env      # fill in the Supabase URL + keys
bun install
bun index.ts              # starts on http://localhost:4000
```

Then, for example:

```sh
curl http://localhost:4000/health
curl http://localhost:4000/v1/elections?status=active
```
