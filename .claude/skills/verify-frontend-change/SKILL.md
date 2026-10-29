---
name: verify-frontend-change
description: >
  Use before declaring ANY UI change done — a new page, component edit, block, style
  tweak, or layout fix — whether or not it came through /build-page. Verifies the
  change end-to-end in a real browser, with evidence. Tool-agnostic: works with
  whatever browser driver is available (Playwright MCP, Chrome DevTools MCP, Claude
  in Chrome, or any equivalent).
---

# Verifying frontend changes

Never report a UI change as complete based on a successful edit, a clean typecheck,
or passing unit tests alone. Verify it the way a human reviewer would: load it, look
at it, interact with it. The checks below are the contract — the tool is whatever
this session has.

## 0. Pick the browser tool (in this order)

1. Any browser-driving tool available in the session: Playwright MCP (configured in
   `.mcp.json`), Chrome DevTools MCP, Claude in Chrome, or another equivalent driver.
   They all cover what's needed: navigate, interact, read the console, screenshot.
2. If NO browser tool is reachable, do not fake it and do not quietly skip:
   run the closest scriptable check you can (`curl` the routes for status/redirects,
   the relevant Playwright spec via `pnpm test:e2e -- --grep <page>`), then report
   the change as **partially verified** and say exactly which checks did not run.

## 1. Get the page in front of you

- Ensure the dev server is running: start `pnpm dev` in the background if it isn't,
  and use its REAL local URL — note the port, don't assume 3000.
- If the change lives behind state (a filled form, a logged-in admin view, a draft
  preview), drive the flow to reach it; don't verify a lookalike page.
- If the content comes from Payload, make sure real (or seeded) content exists —
  an empty page is not a verified page.

## 2. Locales (only if Payload `localization` is configured)

Load the changed page/component in EVERY configured locale:

- [ ] RTL locales render RTL, LTR locales render LTR (`dir` correct, layout mirrored).
- [ ] Nothing that should mirror is stuck (arrows, progress, layout flow) and
      nothing that shouldn't mirror flipped (logo, numerals, media glyphs).
- [ ] Each locale shows real content — no missing-translation keys, no fallback
      language leaking in.
- [ ] Screenshot each locale as evidence.

## 3. Interact with the change itself

- For a new control (button, link, input, toggle, form): use it. Confirm the expected
  state change / navigation / request actually happens — capture before/after.
- For a visual-only change: confirm the specific thing that changed is visible in
  the screenshot, at a mobile width (~375px) AND desktop width (resize or emulate).
- For CMS-bound content: change it in /admin (or confirm the seeded value) and check
  the page reflects it — this proves it isn't hardcoded.

## 4. Console and network must be clean

- [ ] Zero NEW errors or warnings in the browser console on load and after
      interacting (hydration errors count as failures).
- [ ] No failing requests for the flow you exercised (4xx/5xx in the network log).

## 5. Report with evidence, or fix and rerun

- If any step fails: fix it and rerun from step 1. Do not hand back partially
  verified work as done.
- The completion report must show what you OBSERVED — screenshots, console output,
  the URL and port used — not what "should" happen. "It works" without evidence
  is a violation of the project's verification rule.
