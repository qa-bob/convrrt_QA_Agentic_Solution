# Convrrt QA Agentic Solution

Playwright + TypeScript regression test suite for [Convrrt](https://www.convrrt.com) — a B2B SaaS landing page builder platform. Built with the **Page Object Model (POM)** design pattern and OOP principles, and structured for agentic execution with Claude Code.

---

## Purpose

This repository provides automated GUI, functional, and regression coverage for the Convrrt public website without requiring account creation, login, or form submission. Tests run across desktop, tablet, and mobile viewports via GitHub Actions CI.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation |
| TypeScript | ^5.4 | Strongly typed test code |
| Node.js | 20 LTS | Runtime |
| ESLint + @typescript-eslint | ^8 / ^7 | Linting |
| GitHub Actions | — | CI/CD |
| Claude Code | Latest | AI-assisted test generation and maintenance |

---

## Getting Started

### Prerequisites

- Node.js 20 LTS or later ([download](https://nodejs.org/))
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/convrrt_QA_Agentic_Solution.git
cd convrrt_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. (Optional) Install only Chromium — faster for local dev
npx playwright install chromium
```

### Run Tests

```bash
# Run all tests (all browsers)
npm test

# Run a specific tag
npm run test:smoke
npm run test:navigation
npm run test:forms
npm run test:functional
npm run test:visual
npm run test:responsive

# Run in headed mode (watch the browser)
npx playwright test --headed

# Run a single file
npx playwright test tests/functional/hero-section.spec.ts

# Run with Playwright UI (interactive)
npx playwright test --ui

# View the last HTML report
npm run report
```

### Update Visual Baselines

Run this after an intentional design change has been confirmed as correct:

```bash
npm run baseline
```

---

## Project Structure

```
convrrt_QA_Agentic_Solution/
├── site.config.json              # Target site URL, flags, expected nav items
├── playwright.config.ts          # Browser projects: desktop, mobile, tablet
├── global-setup.ts               # Pre-suite reachability check
│
├── src/
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          # BasePage — all POM classes extend this
│   │   ├── home.page.ts          # HomePage — hero, CTAs, headings
│   │   ├── navigation.page.ts    # NavigationPage — nav links, mobile menu
│   │   ├── contact.page.ts       # ContactFormPage — form fields, validation
│   │   ├── faq.page.ts           # FaqPage — FAQ accordion interactions
│   │   └── pricing.page.ts       # PricingPage — plan cards, CTAs
│   ├── fixtures/
│   │   └── site.fixture.ts       # Custom Playwright fixtures (import from here)
│   ├── utils/
│   │   ├── link-checker.ts       # HTTP link health helpers
│   │   └── visual-helper.ts      # Screenshot / cookie-banner helpers
│   └── types/
│       └── site-config.types.ts  # SiteConfig TypeScript interface
│
├── tests/
│   ├── smoke/
│   │   └── site-availability.spec.ts     # @smoke — HTTP status, title, JS errors
│   ├── navigation/
│   │   └── nav-links.spec.ts             # @navigation — nav links, mobile menu
│   ├── forms/
│   │   └── contact-form.spec.ts          # @forms — field presence, labels
│   ├── functional/
│   │   ├── hero-section.spec.ts          # @functional — H1, CTAs, social proof
│   │   ├── dropdown-navigation.spec.ts   # @functional — Product/Use Cases/Resources menus
│   │   ├── faq-accordion.spec.ts         # @functional — FAQ expand/collapse
│   │   ├── pricing-page.spec.ts          # @functional — /pricing plans, CTAs
│   │   ├── cookie-consent.spec.ts        # @functional — consent banner
│   │   └── testimonials.spec.ts          # @functional — quotes, attribution, stats
│   ├── visual/
│   │   └── visual-regression.spec.ts     # @visual — screenshot baselines
│   └── responsive/
│       └── layout.spec.ts                # @responsive — viewport layout, alt text
│
├── .claude/
│   ├── commands/                 # Claude Code slash command definitions
│   ├── agents/                   # Sub-agent definitions (site-analyzer, test-generator)
│   ├── rules/                    # Path-scoped Claude Code rules
│   │   ├── testing.md            # Rules for tests/**/*.spec.ts
│   │   └── typescript.md         # Rules for src/**/*.ts
│   └── settings.json             # Claude Code project settings
│
├── .github/
│   ├── workflows/
│   │   └── ci.yml                # GitHub Actions: smoke → full suite → visual
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md
│   │   └── feature-request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── copilot-instructions.md   # GitHub Copilot context
│
├── AGENTS.md                     # Universal AI agent instructions (all tools)
├── CLAUDE.md                     # Claude Code specific instructions (imports AGENTS.md)
├── SKILLS.md                     # Available slash commands and skills
└── README.md                     # This file
```

---

## Architecture

### Page Object Model (POM)

Every page or major section of the site has a dedicated class in `src/pages/`. Classes:

- Extend `BasePage` from `./base.page`
- Declare locators as `readonly Locator` properties on the class
- Expose **user action methods** (no assertions inside page objects)
- Are consumed by tests through the custom fixture in `src/fixtures/site.fixture.ts`

```typescript
// Example: how tests use page objects
import { test, expect } from '@fixtures/site.fixture';

test('pricing page loads @functional', async ({ pricingPage }) => {
  await pricingPage.navigateToPricing();
  const isLoaded = await pricingPage.isPricingPageLoaded();
  expect(isLoaded).toBeTruthy();
});
```

### Test Tags

| Tag | Suite | What it covers |
|-----|-------|----------------|
| `@smoke` | `tests/smoke/` | HTTP status, page title, JS errors, HTTPS |
| `@navigation` | `tests/navigation/` | Nav links, mobile menu, logo, 404s |
| `@forms` | `tests/forms/` | Field presence, labels, HTML5 validation |
| `@functional` | `tests/functional/` | Hero, dropdowns, FAQ, pricing, testimonials, cookie banner |
| `@visual` | `tests/visual/` | Screenshot regression against baselines |
| `@responsive` | `tests/responsive/` | Mobile/tablet layout, font sizes, alt text |

---

## CI/CD

GitHub Actions runs on every push to `main`/`develop` and on pull requests:

1. **Smoke gate** — fast `@smoke` check on Chromium; blocks the full suite if it fails
2. **Full suite** — runs `@navigation`, `@forms`, `@functional`, `@responsive` plus TypeScript and lint checks
3. **Visual regression** — runs only when `__snapshots__/` has committed baselines

Artifacts (HTML report, JSON results, visual diffs) are uploaded and retained for 7–14 days.

---

## AI-Assisted Development

This repo is structured for agentic execution with **Claude Code**.

### Available Slash Commands

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | Regenerate all POM classes and test suites from scratch |
| `/run-smoke` | Run `@smoke` tests and return a summary |
| `/update-baseline` | Recapture all `@visual` screenshot baselines |
| `/generate-report` | Format the latest `test-results/results.json` as Markdown |

See `SKILLS.md` for full documentation of each skill and when to use it.

### AI Agent Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Universal instructions for all AI coding agents (Claude, Copilot, Cursor, Devin) |
| `CLAUDE.md` | Claude Code–specific extensions (imports `AGENTS.md`) |
| `SKILLS.md` | Documents available slash commands and sub-agents |
| `.github/copilot-instructions.md` | GitHub Copilot context |
| `.claude/rules/testing.md` | Path-scoped rules for `tests/**/*.spec.ts` |
| `.claude/rules/typescript.md` | Path-scoped rules for `src/**/*.ts` |
| `.claude/agents/site-analyzer.md` | Sub-agent: crawl and analyze live sites |
| `.claude/agents/test-generator.md` | Sub-agent: generate site-specific test files |

---

## Contributor Guide

### Before You Start

1. Read `AGENTS.md` — it contains all project rules regardless of AI tool
2. Read `CLAUDE.md` if using Claude Code
3. Understand the [POM architecture](#architecture) before adding selectors

### Adding a New Test

1. **Identify the page** — does a page object already exist in `src/pages/`?
   - If yes, add a new method to that class
   - If no, create `src/pages/<feature>.page.ts` extending `BasePage`
2. **Add the fixture** — register the new page object in `src/fixtures/site.fixture.ts`
3. **Write the test** — import from `@fixtures/site.fixture`, tag the test, use page object methods
4. **Verify** — run `npx tsc --noEmit` and `npm run lint`

### Selector Rules

1. `getByRole()` — preferred (most resilient)
2. `getByLabel()` / `getByPlaceholder()` — for form fields
3. `getByText()` — for links and buttons
4. `locator('[data-testid="..."]')` — when test IDs exist
5. `locator('[class*="keyword"]')` — CSS heuristics (last resort)

### Hard Rules

- Never submit a form
- Never hardcode `https://www.convrrt.com` in a test — use `siteConfig.url` or `baseURL`
- Never put `expect()` inside a page object method
- Never use `page.waitForTimeout()` — use Playwright's built-in auto-waiting
- Never use `any` type without an inline explanation
- Run `npx tsc --noEmit` before opening a pull request

### Opening a Pull Request

Use the PR template (`.github/PULL_REQUEST_TEMPLATE.md`). All items in the
pre-merge checklist must be checked before requesting review.

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Tests fail with "Target closed" | Site may be unreachable — check `global-setup.ts` output |
| Visual tests fail unexpectedly | Run `npm run baseline` to update snapshots after confirmed design change |
| TypeScript errors after adding a page object | Ensure the class is exported and the fixture is updated |
| ESLint errors | Run `npm run lint -- --fix` for auto-fixable issues |
| Playwright can't find an element | Use `npx playwright codegen https://www.convrrt.com` to inspect selectors live |

---

*This test suite is maintained as part of the Phoenix Startup QA Agentic Solutions project.*
