---
name: nextjs-frontend
description: >
  Use when writing or changing anything under src/app/(frontend)/ or src/components/ —
  pages, layouts, components, blocks, forms, data fetching, Server Actions, caching,
  or metadata. Enforces Server Components by default, minimal and leaf-level
  'use client', safe Payload data access, and Next.js 16 APIs.
---

# Next.js 16 frontend rules

Next.js 16 differs from older versions. When unsure about an API, read the installed
docs in `node_modules/next/dist/docs/01-app/` (start with
`01-getting-started/05-server-and-client-components.md`) — not memory.

## 1. Server Components by default

Pages, layouts, and components are Server Components unless proven otherwise. They:
- fetch data directly from Payload via the Local API (no API round-trip, no `useEffect`),
- keep secrets and DB access on the server,
- ship zero JavaScript for static UI.

Pages and layouts are `async` and await their props: `params` and `searchParams` are
**Promises** in Next 16 (`const { slug } = await params`).

## 2. `'use client'` only when needed

Add `'use client'` ONLY if the component needs one of:
- state or event handlers (`useState`, `onClick`, `onChange`, …),
- effects / lifecycle (`useEffect`, `useLayoutEffect`),
- browser-only APIs (`window`, `localStorage`, `IntersectionObserver`, …),
- a hook or third-party component that uses the above.

Rules:
- **Never** on `page.tsx`, `layout.tsx`, `template.tsx`, `not-found.tsx`, or a block
  renderer. (`error.tsx` is the exception — Next requires it to be a Client Component.)
  A hook flags `'use client'` on pages/layouts after every edit.
- **Push the boundary to the leaves.** `'use client'` makes every import of that file
  client code too. Extract just the interactive bit: a server `<Header>` renders a client
  `<MobileMenuToggle>`, not the reverse.
- **Compose with `children`.** To put server-rendered UI inside a client wrapper (modal,
  accordion, carousel), pass it as `children`/props — it stays a Server Component.
- **Props crossing the boundary must be serializable**: plain objects, arrays, strings,
  numbers, dates, Server Actions. No functions (except Server Actions), class instances,
  or the whole Payload document when you only need three fields — pick the fields.
- **Context providers** are client components that wrap only `{children}`, rendered as
  deep in the tree as possible, never around `<html>`.
- **Third-party client-only components** (carousels, maps, animation libs) get a thin
  `'use client'` wrapper file that re-exports them, so Server Components can use them.

## 3. Data access (Payload)

- Fetch in Server Components with the Local API:
  `const payload = await getPayload({ config })`.
- **Public pages pass `overrideAccess: false`.** The Local API skips access control by
  default — without it, unpublished drafts and private fields leak onto the public site.
  For draft preview, pass `draft: true` only after verifying the preview request.
- Put queries in server-only modules (e.g. `src/lib/queries/*.ts`) starting with
  `import 'server-only'`, so importing one into a Client Component fails the build.
  (Install the `server-only` package the first time you need it.)
- Use `depth` and `select` to fetch only what the page renders.
- Run independent queries in parallel (`Promise.all`), not as a waterfall.
- Never `fetch('/api/...')` your own Payload REST API from a Server Component.

## 4. Mutations: Server Actions

- Forms and mutations use Server Actions (`'use server'`), not client-side `fetch`
  to a route handler. Route handlers are for webhooks and external callers.
- A Server Action is a public POST endpoint. Inside **every** action: validate input,
  check auth/authorization, then call Payload with `overrideAccess: false` + `user`.
- Prefer `<form action={action}>` — it works before JavaScript loads. Use
  `useActionState` / `useFormStatus` in a small client component for pending/error UI.

## 5. Streaming, loading, and errors

- Wrap slow or request-time parts (cookies, headers, searchParams, uncached reads) in
  `<Suspense fallback={…}>` so the rest of the page renders immediately.
- Use `loading.tsx` for route-level skeletons and `error.tsx` / `not-found.tsx`
  (call `notFound()` when Payload returns no doc).

## 6. Caching and revalidation

- Check `next.config.ts` first. **This template does not enable `cacheComponents`**, so
  the previous caching model applies: see
  `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`.
  If a project enables `cacheComponents: true`, use `'use cache'` + `cacheLife` instead
  (`01-getting-started/08-caching.md`). Don't mix the two models.
- Payload Local API calls are not `fetch`, so they aren't cached automatically. Cache
  them deliberately (`unstable_cache` with `tags` in the previous model, `'use cache'` +
  `cacheTag` with Cache Components), and dedupe per request with React `cache()`.
- Refresh content when editors publish: Payload `afterChange`/`afterDelete` hooks call
  `revalidatePath(path)` or `revalidateTag(tag, 'max')`. The one-argument
  `revalidateTag(tag)` is **deprecated** in Next 16. Inside Server Actions, prefer
  `updateTag(tag)` for read-your-own-writes.

## 7. Images, fonts, metadata

- Images: `next/image` with `width`/`height` (or `fill` + `sizes`), alt text from Payload.
  Payload uploads are served from `/api/media/file/**` (already allowed in `next.config.ts`).
- Fonts: `next/font` — never a `<link>` to Google Fonts.
- Metadata: export `metadata` or `generateMetadata` from pages/layouts, sourced from
  Payload (SEO fields). Never put `<title>`/`<meta>` tags in JSX by hand.
- Links: `next/link` for internal navigation.

## Before marking a frontend task done
- [ ] Every `'use client'` file is justified by §2 and is as small as it can be.
- [ ] No `'use client'` on pages, layouts, or block renderers.
- [ ] Public Payload queries pass `overrideAccess: false`; drafts don't render publicly.
- [ ] No client-side fetching of data a Server Component could have fetched.
- [ ] Server Actions validate input and check authorization.
- [ ] Verified in a browser per the `verify-frontend-change` skill (console clean, no
      hydration errors).
