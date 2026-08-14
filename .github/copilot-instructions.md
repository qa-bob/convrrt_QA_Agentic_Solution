# GitHub Copilot Instructions

> This file is read by GitHub Copilot when suggesting code in this repository.
> See `AGENTS.md` in the root for the full project context. The rules below
> summarise the most important conventions for code generation.

---

## Project Context

This is a **Playwright + TypeScript regression test suite** for
[Convrrt](https://www.convrrt.com), a B2B SaaS landing page builder. Tests use
the **Page Object Model (POM)** pattern and run across desktop, mobile, and
tablet viewports.

---

## Key Conventions

### Imports

```typescript
// Tests always import from the custom fixture
import { test, expect } from '@fixtures/site.fixture';

// Page objects import from @playwright/test, not the fixture
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
```

### Page Objects

```typescript
export class MyPage extends BasePage {
  readonly myButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.myButton = page.getByRole('button', { name: /my button/i });
  }

  async clickMyButton(): Promise<void> {
    await this.myButton.click();
  }
}
```

- Extend `BasePage`, declare locators as `readonly Locator` properties
- Methods are user actions — no `expect()` inside page objects

### Tests

```typescript
test('feature works correctly @functional', async ({ myPage }) => {
  await myPage.navigate();
  await expect(myPage.myButton).toBeVisible();
});
```

- Every test title must include a tag: `@smoke | @navigation | @forms | @functional | @visual | @responsive`
- Do not hardcode URLs — use `siteConfig.url` or `baseURL`
- Do not submit forms — interact with fields only
- Do not use `page.waitForTimeout()` — use Playwright auto-waiting

### TypeScript

- Strict mode: no implicit `any`
- All properties and return types must be annotated
- Run `npx tsc --noEmit` before suggesting a task is complete
