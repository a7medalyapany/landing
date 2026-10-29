# Architecture

> Template — fill in for your project. Agents read this before any non-trivial change,
> so keep it accurate; update it in the same commit as the code that changes it.

## 1. Overview
_What the site is, who edits it, who visits it. 3–5 sentences._

## 2. Stack
- Next.js 16 (App Router) — frontend in `src/app/(frontend)/`
- Payload CMS 3 embedded — admin at `/admin`, REST/GraphQL in `src/app/(payload)/`
- Postgres via `@payloadcms/db-postgres` (see `docs/decisions/`)
- _Hosting, storage, email: …_

## 3. Module boundaries
| Path | Responsibility | May import from |
|---|---|---|
| `src/app/(frontend)/` | Pages, Server Components | `components/`, `lib/`, Payload Local API |
| `src/app/api/` / route handlers | HTTP only: validate → call service → respond | services, `lib/` |
| `src/collections/`, `src/globals/` | Payload schema + access + hooks | `lib/`, `access/` |
| `src/lib/` | Pure helpers (no I/O) | — |
| `src/app/(payload)/`, `src/payload-types.ts` | Generated — never hand-edit | — |

## 4. Data model
_One row per collection/global: purpose, key fields, relationships, localized?, drafts?_

| Collection / Global | Purpose | Key fields | Access (read / write) |
|---|---|---|---|
| `users` | Admin auth | email, roles | admin only |
| `media` | Uploads | alt | public read / editors write |

## 5. Access model
_Roles and what each may do. Public = published docs only._

## 6. Rendering & caching
_Static vs dynamic routes, revalidation strategy (e.g. `afterChange` hooks → `revalidatePath`)._

## 7. Environments & deploy
_Local (docker-compose Postgres), preview, production. How migrations are applied —
see `docs/runbooks/prod-migrations.md`._
