---
name: rtl-bilingual-component
description: >
  Use when building or porting any UI component, page, block, or layout — and
  whenever adding locales, RTL support (e.g. Arabic, Hebrew, Persian), or
  translatable content. Ensures correct RTL/LTR mirroring, multilingual content
  wiring, and that nothing editors should manage is hardcoded.
---

# RTL + multilingual component rules

The template must stay RTL-ready even while single-language: build every component
direction-agnostic. When localization is enabled, `dir` and `lang` are set on `<html>`
from the active locale.

## CSS / Tailwind
- Use logical properties only: `ps-`/`pe-` (padding-inline), `ms-`/`me-` (margin-inline),
  `start-`/`end-`, `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s`/`rounded-e`.
  NEVER `pl-`/`pr-`/`left-`/`right-`/`text-left`/`text-right`.
- In plain CSS: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, etc.
  When porting a design export, find-and-replace physical → logical or run it through
  `rtlcss`.
- Do NOT mirror: brand logo, media-control glyphs (play/pause), numerals, code.
  DO mirror: layout flow, directional arrows/chevrons, progress direction, carousels.
  For icons that must mirror, use `rtl:-scale-x-100` (Tailwind) or `[dir=rtl] & { transform: scaleX(-1) }`.

## Content
- Editor-managed content (headings, body, CTAs, SEO, alt text) → Payload fields with
  `localized: true`, using Payload's built-in `localization` config
  (`locales`, `defaultLocale`, `fallback`). Query with the `locale` option of the
  Local API. Do NOT create parallel `title_en`/`title_ar` fields.
- Fixed UI chrome (nav aria labels, form validation messages, "Read more") → a message
  catalog per locale (e.g. next-intl `messages/{locale}.json`). Check what the project
  already uses before adding a library.
- If you're about to hardcode a visible string, stop — it almost certainly belongs in
  Payload or the message catalog.
- Fonts: confirm the font stack covers every locale's script (e.g. an Arabic face).

## Before marking a UI task done
- [ ] No physical-direction CSS leaked in (grep the diff for `pl-|pr-|left-|right-|text-left|text-right|margin-left|margin-right`).
- [ ] If localized: renders correctly in every locale, RTL and LTR (check, don't assume —
      see the verify-frontend-change skill).
- [ ] No visible string hardcoded that an editor or translator should own.
