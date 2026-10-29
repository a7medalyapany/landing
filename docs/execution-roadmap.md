# Execution Roadmap

> Template — the task tracker. Tick tasks in the same commit as the work.

## Status Legend
⬜ Not started 🔄 In progress ✅ Complete 🚫 Blocked

## Critical Path
```
M0 foundation → M1 content model → M2 frontend blocks → M3 SEO/perf → M4 launch
```

---

## M0 — Foundation
| # | Task | Status | Notes |
|---|---|---|---|
| 0.1 | AI workflow layer (`.claude/`, `.mcp.json`, docs) | ✅ | see `docs/ai-workflow.md` |
| 0.2 | Postgres local dev via docker-compose | ✅ | `docker compose up -d postgres` |
| 0.3 | Env validation at startup | ⬜ | |
| 0.4 | Migrations workflow (no push mode in prod) | ⬜ | |
| 0.5 | Tailwind CSS v4 (frontend only) | ✅ | `@tailwindcss/postcss`; imported in `(frontend)/styles.css` |

## M1 — Content model
| # | Task | Status | Notes |
|---|---|---|---|
| 1.1 | _…_ | ⬜ | |
