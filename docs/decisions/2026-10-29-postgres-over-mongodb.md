# Decision: PostgreSQL over MongoDB

**Date:** 2026-10-29
**Status:** Accepted

## Context
Payload CMS 3.x supports Postgres and MongoDB as first-class adapters. The Payload
blank template shipped a MongoDB `DATABASE_URL` in `.env.example` and a Mongo service
in `docker-compose.yml` (both since replaced), while `src/payload.config.ts` already used
`@payloadcms/db-postgres`.

## Decision
PostgreSQL via `@payloadcms/db-postgres`. `.env.example` uses a `postgres://` URL.

## Alternatives Considered
### Option A — MongoDB
**Rejected because:** CMS content is relational (pages → blocks → media, globals,
redirects); Postgres gives versioned, reviewable SQL migrations and transactional
guarantees, and is available on every major host (Neon, Supabase, RDS, Vercel).

## Consequences
- Schema changes require migrations (`pnpm payload migrate:create`), committed with
  the change. Dev uses push mode; production never does.
- `docker-compose.yml` runs Postgres 17 for local dev (roadmap 0.2).
