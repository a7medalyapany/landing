# Runbook — Applying migrations to production

**Status:** every production apply is a HUMAN-APPROVAL GATE (CLAUDE.md workflow rule).
Nothing applies migrations to prod automatically — not the build, not CI.

## Why it's manual
- `next build` runs on every preview deploy; a migrate step there would race concurrent
  builds against one DB and apply schema from unreviewed branches.
- In local dev, Payload uses push mode (schema synced automatically). `payload migrate`
  against a push-managed DB detects drift and prompts about data loss — don't.

## Creating a migration (any developer / agent)
1. Change the collection/global/field.
2. `pnpm generate:types`
3. `pnpm payload migrate:create <descriptive-name>`
4. Review the generated SQL in `src/migrations/`. Anything destructive (drop/rename
   column, type change) → call it out in the PR.
5. Commit the migration in the same commit as the schema change.

## Applying to production (human only)
1. Back up the production DB (or create a branch/snapshot if the host supports it).
2. Point `DATABASE_URL` at production in a shell **not** used for dev.
3. `pnpm payload migrate:status` — confirm only the expected migrations are pending.
4. `pnpm payload migrate`
5. `pnpm payload migrate:status` — confirm all applied. Deploy the matching code.
6. If it fails: stop, restore from the backup/snapshot, record the cause in
   `docs/debugging-notes.md`.
