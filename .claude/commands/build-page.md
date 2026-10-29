---
description: Build one page end-to-end (CMS-bound frontend + logic + tests) via the full governed loop
argument-hint: <page-name> [design-ref]
---

You are implementing ONE page end-to-end: $1
Design reference (optional): $2

Follow this loop strictly. Do not skip phases. Stop at each STOP gate and wait for me.

## Phase 0 — Orient (read-only)

- Read CLAUDE.md, docs/architecture.md, docs/execution-roadmap.md, and any relevant
  ADRs in docs/decisions/. Dispatch the `researcher` subagent for unfamiliar areas.
- Check whether Payload `localization` is configured in `src/payload.config.ts`. If it
  is, read the rtl-bilingual-component skill — every later phase must honor it.
- If a design reference was given, pull it with the tool you actually have (Figma MCP
  for a figma.com URL, Read for a local export). If you can't reach it, ask me to export
  it — do not fabricate an endpoint. No reference → reuse existing components/tokens.
- Identify which execution-roadmap task(s) this page covers.

## Phase 1 — Plan (STOP gate)

Produce a short plan: the route(s) under src/app/(frontend)/, the data it binds to
(which Payload collections/globals/blocks/fields, new or existing), any route handlers
or services needed, the access rules involved, locale handling (if localized), and
the tests you'll write. Reuse existing components and design tokens — don't reinvent.
=> STOP. Wait for my approval before writing code.

## Phase 2 — Branch

Slugify $1 into <slug> (lowercase; spaces/underscores → dashes; ASCII only) and use it
for both the branch name and the route segment.
Branch from a fresh base so pages never stack on each other (base = `main` unless
CLAUDE.md names another integration branch):
  git checkout main && git pull --ff-only && git checkout -b feat/page-<slug>
If there is no remote yet, skip the pull. If feat/page-<slug> already exists (a resumed
run), check it out instead of recreating it. Confirm the branch name back to me.

## Phase 3 — Implement

- Build the page as Server Components reading from Payload via the Local API.
- Editor-managed content (copy, images, links, SEO) comes from Payload — never hardcoded.
- Logical CSS properties only (ps/pe, ms/me, start/end). No hard left/right.
- If localized: wire every locale per the rtl-bilingual-component skill.
- Implement the backend too, not just UI: collections/fields, access control, hooks,
  route handlers and services this page needs, following the module boundaries.
- After schema changes run `pnpm generate:types` (and `pnpm generate:importmap` if you
  added admin components).

## Phase 4 — Test (with evidence)

- Write/extend Vitest tests for the logic and access rules (e.g. drafts not publicly
  readable). Add/extend a Playwright spec for the page's main flow when it has one.
- Run `pnpm test:int`, `pnpm typecheck`, and `pnpm lint`. Paste the output.
- Follow the verify-frontend-change skill to drive the page in a real browser with
  whatever browser tool this session has. Report what you observed — show evidence,
  don't assert "it works".

## Phase 5 — Governance & migrations (STOP gate)

If this page added or changed any Payload collection/global/field, generate the
migration now: `pnpm payload migrate:create <slug>` and commit it with the code. Do NOT
run `pnpm payload migrate` against any shared/production database — applying a
migration is a human-approval gate; flag it and wait for me.
Invoke the governance-reviewer subagent on this change. Resolve any BLOCK. If anything
in docs/ drifted from what we built (routes, data shapes, decisions), update the
relevant docs/ file IN THIS CHANGE.
=> STOP. Show me the governance report and the diff. Wait for my confirmation.

## Phase 6 — Commit & push (only after my confirmation)

- Tick the completed task(s) in docs/execution-roadmap.md.
- Commit code + tests + migration (if any) + doc updates together with a clear message.
- Push the branch: git push -u origin feat/page-<slug>
- Give me the branch name so I can open a PR.

## Loop

After push, ask if I want to refine this page or move to the next. Do not start a new
page in the same run.
