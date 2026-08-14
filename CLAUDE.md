@AGENTS.md

# Claude Code — Project Instructions

The common project rules, architecture, and file layout are in `AGENTS.md`
(imported above). This file adds Claude Code–specific workflows and commands.

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/generate-full-suite` | Analyze the website and generate complete POM + tests |
| `/analyze-site` | Inspect site structure and report pages, forms, and elements |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate a test results summary |

---

## When Asked to Write or Update Tests

1. Read `site.config.json` first to get the URL and all flags
2. Use `WebFetch` to inspect the live site before writing any selectors
3. Write real selectors based on actual page HTML, not generic placeholders
4. Create or update the relevant page object class in `src/pages/`
5. Write tests that use the page object, not raw `page.locator()` calls in the test body
6. Run `npx tsc --noEmit` to verify TypeScript compiles cleanly
7. Add the new page object to `src/fixtures/site.fixture.ts` if needed

---

## Test Tagging Reference

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title present, no console errors |
| `@navigation` | Nav links, routing, menus, breadcrumbs |
| `@forms` | Form fields, validation, accessibility |
| `@functional` | Business features: pricing, hero, FAQ, testimonials, dropdowns |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport-specific layout checks |
| `@custom` | Site-specific scenarios beyond the generic framework |

---

## Memory

When you discover site-specific patterns (e.g. which CSS class Convrrt uses for
its accordion, or which locator consistently finds the hero CTA), save them to
auto memory so future sessions don't re-discover them. The memory system is at
`.claude/projects/*/memory/`.
