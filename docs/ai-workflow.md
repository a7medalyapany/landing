# AI Engineering Setup & Workflow

How this project is built with AI: spec-driven, verification-first, with a thin
tooling layer inside Claude Code that keeps every change anchored to the spec.

## The core idea
The bottleneck isn't how fast code gets written — it's *drift*: plausible code that
quietly solves the wrong problem. The fix is spec-driven development: the spec
(`docs/`) is the artifact, the code is the build output.

The loop is: **research → plan → execute → verify → review → ship**, with the human as
oversight, not typist. Context is the constraint, so heavy reading happens in
subagents and the main session stays clean. Verification is the single most important
practice — if a change can't be checked with evidence (a test, a browser run), it
doesn't ship.

## The tooling layer (`.claude/` + `.mcp.json`)

### `CLAUDE.md` — the constitution (kept short on purpose)
Stack, commands, module boundaries, non-negotiables, workflow rules. Short because an
over-stuffed CLAUDE.md gets half-ignored. Anything context-specific lives in a skill.
The `nextjs-agent-rules` block is written by `next dev` — leave it in place.

### Skills (`.claude/skills/*/SKILL.md`) — just-in-time playbooks
Loaded only when their description matches the task, so they cost nothing until needed:
- `payload` — Payload CMS reference (fields, hooks, access control, queries).
- `nextjs-frontend` — Server Components by default, `'use client'` only for small
  interactive leaves, safe Payload reads (`overrideAccess: false`), Server Actions,
  and Next 16's caching/revalidation APIs (checked against the installed docs).
- `verify-frontend-change` — end-to-end browser verification of any UI change, with
  evidence, using whatever browser tool the session has.
- `rtl-bilingual-component` — logical CSS, mirroring rules, Payload field
  localization, and the no-hardcoded-content rule.

Add a skill when a trap is discovered twice (see `docs/debugging-notes.md`) — encode
it so it's enforced at build time, not rediscovered.

### Subagents (`.claude/agents/*.md`) — isolated context
- `researcher` (Sonnet, read-only) — explores code/docs, returns a cited summary,
  keeps the main context clean before planning.
- `governance-reviewer` (Opus) — reviews a finished task against the spec with fresh
  eyes; PASS / FLAG / BLOCK. The agent that wrote the code is not the one that grades it.

### Commands (`.claude/commands/*.md`)
- `/build-page <name> [design-ref]` — one page end-to-end through the governed loop,
  with STOP gates after planning and after review.

### Hooks (`.claude/hooks/` + wired in `.claude/settings.json`) — deterministic guardrails
- `block-protected-writes.sh` (PreToolUse) — refuses edits to Payload-generated files
  (`payload-types.ts`, `src/app/(payload)/*` except `custom.scss`) and `.env` secrets
  (`.env.example` is allowed). System-side enforcement beats hoping the prompt holds.
- `post-edit-checks.sh` (PostToolUse) — runs `pnpm typecheck` after a `.ts/.tsx` edit
  in `src/` or `tests/`, flags `'use client'` on pages/layouts, and feeds both back so
  Claude self-corrects.
- Both need `jq`. Without it the hooks print a warning and skip.

### Permissions (`.claude/settings.json`) — deny-first
Tests, lint, typecheck, type generation and read-only git are pre-approved. `git push`,
applying migrations, `vercel` and destructive docker commands ask first. `.env` reads
and `rm -rf` are denied. Personal overrides go in `.claude/settings.local.json`
(git-ignored).

### MCP servers (`.mcp.json`) — kept to three
Each server costs context, so only what earns its place weekly:
- `context7` — current, version-specific docs. Next.js 16 and Payload 3.x move fast;
  this keeps generated code on today's API.
- `playwright` — the verification surface for `verify-frontend-change`.
- `github` — repo/PR/issue work inline. Needs `GITHUB_PERSONAL_ACCESS_TOKEN` exported
  in your shell (never committed).

Don't add MCP servers for their own sake. A database MCP is unnecessary — the Payload
Local API and `psql` cover it.

## The per-task loop
1. **Plan.** Pick the task in `docs/execution-roadmap.md`. If it touches unfamiliar
   code, dispatch `researcher` first.
2. **Execute.** Implement the single task. Skills auto-load; hooks catch type errors
   and protected-path mistakes as you go.
3. **Verify with evidence.** Tests + `verify-frontend-change` for UI. Show output.
4. **Review.** Run `governance-reviewer`. Resolve any BLOCK.
5. **Ship.** Commit code, migration (if any), and doc updates together. Tick the task.

## Starting a new project from this template
1. Fill in `docs/architecture.md` and `docs/execution-roadmap.md` for the new project.
2. Add project-specific non-negotiables to CLAUDE.md (keep it short).
3. Write an ADR in `docs/decisions/` for each significant choice.

> Spec overhead is a real cost. For a one-line fix, skip the ceremony and just prompt.
> The rule: if you'd be annoyed for the agent to interpret it differently than you
> meant, it goes through the loop. Otherwise, prompt directly.
