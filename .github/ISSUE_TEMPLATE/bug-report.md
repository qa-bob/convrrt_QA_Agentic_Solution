---
name: Bug report
about: A test is failing or producing incorrect results
title: "[BUG] "
labels: bug
assignees: ''
---

## Failing test

<!-- Paste the full test name including the file path and test title -->

**File:** `tests/.../<spec-file>.spec.ts`
**Test:** `<describe block> > <test title>`
**Tag:** `@smoke` / `@navigation` / `@forms` / `@functional` / `@visual` / `@responsive`

---

## What happened

<!-- Describe the failure: error message, screenshot, or unexpected assertion -->

```
Error: <paste error here>
```

---

## What was expected

<!-- What should the test assert / what is the correct behavior? -->

---

## Steps to reproduce

```bash
npx playwright test --grep "<test title>" --headed
```

1.
2.
3.

---

## Environment

- Browser project: `chromium-desktop` / `mobile-chrome` / `tablet`
- Playwright version: (run `npx playwright --version`)
- Node version: (run `node --version`)
- Site URL tested: `https://www.convrrt.com`

---

## Possible cause

<!-- Optional: selector changed, site redesign, flaky network, etc. -->
