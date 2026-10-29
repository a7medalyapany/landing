# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

# Project constitution

Landing-page boilerplate. Next.js 16 + Payload CMS 3 (embedded) + Postgres
(`@payloadcms/db-postgres`). Kept short on purpose — context-specific rules live in
skills under `.claude/skills/`. The AI workflow is explained in `docs/ai-workflow.md`.

The spec lives in `docs/`. Read `docs/architecture.md` before any non-trivial change.
`docs/execution-roadmap.md` is the task tracker. Update it in the same commit as the work.
Record significant choices as ADRs in `docs/decisions/`.

## Commands

- `docker compose up -d postgres` — local Postgres on :5432 (`docker compose down -v` wipes it)
- `pnpm dev` — local dev (admin at /admin)
- `pnpm test` — integration (Vitest) + e2e (Playwright); `pnpm test:int` / `pnpm test:e2e` separately.
  Tests run only against `TEST_DATABASE_URL` (never `DATABASE_URL`); e2e starts its own
  server on :3001, so `pnpm dev` must be stopped first.
- `pnpm typecheck` — tsc --noEmit
- `pnpm lint` — ESLint (flat config, `eslint-config-next`)
- `pnpm generate:types` / `pnpm generate:importmap` — after schema / admin component changes
- `pnpm payload migrate:create` / `pnpm payload migrate` — schema migrations

## Module boundaries

- `app/api/*` and route handlers are HTTP only — validate input, call a service, return.
- DB access goes through the Payload Local API. No raw SQL without an ADR.
- `lib/` is pure (no I/O) unless a file is listed here as an exception.
- `src/app/(payload)/*` (except `custom.scss`) and `src/payload-types.ts` are generated.
  Never hand-edit them; regenerate instead. A hook enforces this.

## Non-negotiables (these are bugs if violated)

- Every collection/global declares access control. Public reads return published docs only.
- Local API calls made on behalf of a user pass `user` and `overrideAccess: false`.
- Server Components by default. `'use client'` only for state, event handlers, effects,
  or browser APIs — as small leaf components, never on pages or layouts. Details: the
  `nextjs-frontend` skill.
- Editor-managed content (copy, images, links, SEO) comes from Payload, never hardcoded.
- Use logical CSS properties (`ps-`/`pe-`, `ms-`/`me-`, `start`/`end`), never hard
  `left`/`right` — the template must stay RTL-ready.
- After any schema change: `pnpm generate:types` + `pnpm payload migrate:create`, and
  commit the migration in the same commit as the schema change.
- Secrets live in `.env` only; `.env.example` documents every variable.

## Workflow

- Plan before implementing. For unfamiliar code, dispatch the `researcher` subagent first.
- Verify with evidence: tests, or a real-browser run (`verify-frontend-change` skill),
  not "it should work."
- After a non-trivial task, the `governance-reviewer` subagent checks it against the spec.
- Applying migrations, `git push`, and live-key/env changes are human-approval gates.
  Stop and ask.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
