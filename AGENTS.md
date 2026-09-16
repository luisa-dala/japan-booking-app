# JapanStay

## Overview
Next.js 14 (App Router) landing page with search & filter for Japanese accommodations, backed by PostgreSQL 16.

## Setup
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
This starts PostgreSQL, seeds it with ~12 sample listings (one-shot `seed` service), and runs the Next.js dev server on port 3000.

## Architecture
- **Frontend**: Next.js App Router + Tailwind CSS, client-side filtering via API calls
- **Backend**: Next.js API route at `/api/listings` queries PostgreSQL with search/filter params
- **Database**: PostgreSQL 16, seeded on every `up` by the `seed` compose service

## Key files
- `app/page.tsx` — landing page with hero search, filter bar, and listing grid
- `app/api/listings/route.ts` — API route returning filtered/sorted listings
- `lib/db.ts` — PostgreSQL connection pool (singleton, hot-reload safe)
- `scripts/seed.mjs` — creates table and inserts sample data

## Verification
- Visit `http://localhost:3000` — landing page with listings should render
- Use the search bar (e.g. "Kyoto") and filter dropdowns to narrow results
- `curl http://localhost:3000/api/listings` returns all listings as JSON
- `curl "http://localhost:3000/api/listings?type=ryokan&sort=rating_desc"` tests filtering

## Notes
- No external secrets required — PostgreSQL runs locally in compose
- `next.config.mjs` sets `allowedDevOrigins` for the preview origin
