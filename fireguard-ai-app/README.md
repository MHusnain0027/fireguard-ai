# FireGuard FACP Search System

Next.js dashboard for searching the `public.locations` table in Supabase and
replacing its data through the authenticated admin Excel-upload screen.

## Secure configuration

The database flow is:

```text
Search UI -> /api/locations -> server-only Supabase client -> locations table
Admin login -> /api/upload -> Firebase token verification -> locations table
```

The Supabase secret key is never read by a Client Component. Copy `.env.example`
to `.env.local` and add a newly rotated server secret there. Never commit
`.env.local` and never prefix the secret with `NEXT_PUBLIC_`.

Full Roman English instructions are available in `SUPABASE-SETUP.md`.

## Run locally

```bash
cd /workspaces/fireguard-ai/fireguard-ai-app
cp .env.example .env.local
nano .env.local
npm install
npm run dev
```

Open `http://localhost:3000` and verify the API:

```bash
curl -s http://localhost:3000/api/locations
```

## Required production variables

```text
SUPABASE_URL=https://magpoxmpqlxhifegzwqd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<new rotated sb_secret_ key>
```
