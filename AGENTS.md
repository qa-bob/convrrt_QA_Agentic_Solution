# AGENTS.md — Convrrt QA Agentic Solution

> Universal instructions for all AI coding agents working in this repository
> (Claude Code, GitHub Copilot, Cursor, Devin, and others).

---

## Project Purpose

Build and maintain a comprehensive GUI, functional, and regression test suite for
[Convrrt](https://www.convrrt.com) — a B2B SaaS landing page builder platform.
Tests must cover every discoverable feature without requiring account creation or
any actual form submission.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Test runner | [Playwright](https://playwright.dev/) v1.44+ |
| Language | TypeScript (strict mode) |
| Pattern | Page Object Model (POM) + OOP |
| CI | GitHub Actions |
| Linting | ESLint + `@typescript-eslint` |

---

## Repository Layout

```
site.config.json          # Target site URL and flags (source of truth)
playwright.config.ts      # Playwright projects: desktop, mobile, tablet
global-setup.ts           # Pre-suite reachability check
src/
  pages/                  # One POM class per page/section
    base.page.ts          # BasePage — all page classes extend this
    home.page.ts          # HomePage
    navigation.page.ts    # NavigationPage
    contact.page.ts       # ContactFormPage
    faq.page.ts           # FaqPage
    pricing.page.ts       # PricingPage
  fixtures/
    site.fixture.ts       # Custom Playwright fixtures (import from here)
  utils/
    link-checker.ts       # HTTP link health helpers
    visual-helper.ts      # Screenshot / cookie-banner helpers
  types/
    site-config.types.ts  # SiteConfig TypeScript interface
tests/
  smoke/                  # @smoke — site loads, HTTPS, title, no JS errors
  navigation/             # @navigation — nav links, mobile menu, logo
  forms/                  # @forms — field presence, labels, validation
  functional/             # @functional — business features and user flows
  visual/                 # @visual — screenshot regression baselines
  responsive/             # @responsive — viewport layout, alt text, font-size
.claude/
  commands/               # Slash commands for Claude Code
  agents/                 # Sub-agent definitions
  rules/                  # Path-scoped rules loaded per file type
  settings.json           # Claude Code project settings
.github/
  workflows/ci.yml        # GitHub Actions CI pipeline
  PULL_REQUEST_TEMPLATE.md
  ISSUE_TEMPLATE/
  copilot-instructions.md # GitHub Copilot instructions (mirrors this file)
```

---

## Architecture Rules

### Page Object Model (POM)

- Every page or major section has its own class in `src/pages/`
- All page classes extend `BasePage` from `./base.page`
- Locators are `readonly Locator` properties declared on the class
- Methods represent **user actions**, not assertions
- **No `expect()` calls inside page objects** — assertions belong in tests only

### Tests

- Import `{ test, expect }` from `@fixtures/site.fixture`, never directly from
  `@playwright/test`
- Tag every test with at least one tag: `@smoke | @navigation | @forms |
  @functional | @visual | @responsive`
- Do **not** hardcode URLs — always use `baseURL` from Playwright config, which
  reads `site.config.json`
- **Never submit forms** — test field interactions and validation only
- **Never create accounts or log in** (unless `auth.required: true` in config)

### TypeScript

- Strict mode is enabled — zero implicit `any` without explicit justification
- Run `npx tsc --noEmit` before considering any task complete
- All page object properties and method return types must be annotated

---

## Available npm Scripts

```bash
npm test                    # Run all tests (all browsers, all tags)
npm run test:smoke          # @smoke tests only
npm run test:navigation     # @navigation tests only
npm run test:forms          # @forms tests only
npm run test:visual         # @visual screenshot regression
npm run test:responsive     # @responsive viewport tests
npm run baseline            # Update visual snapshots (run after intentional UI changes)
npm run lint                # ESLint
npm run typecheck           # TypeScript check (no emit)
```

---

## Convrrt Site Map (as of last analysis)

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, features, testimonials, FAQ |
| `/pricing` | Plan comparison and pricing |
| `/#faq` | FAQ accordion (on homepage) |
| Navigation: Product | Dropdown → Features, How It Works, Pop-up Builder, Live Demo |
| Navigation: Use Cases | Dropdown → CRM, Marketing Automation, Virtual Events |
| Navigation: Resources | Dropdown → Blog, Case Studies, Whitepapers, Vision & Mission |

---

## Hard Rules (Do Not Violate)

- Do **not** submit any form (contact, demo, signup)
- Do **not** create accounts or enter real credentials
- Do **not** hardcode the base URL in any test file
- Do **not** put `expect()` assertions inside page object methods
- Do **not** use `page.waitForTimeout()` — use Playwright's auto-waiting or
  `waitForSelector` instead
- Do **not** use `any` type without an inline comment explaining why
- Do **not** disable TypeScript checks with `@ts-ignore` without explanation
