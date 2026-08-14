---
paths:
  - "src/**/*.ts"
---

# TypeScript / Page Object Rules

These rules apply when Claude is writing or editing files under `src/`.

## Class Structure

All page classes must follow this pattern:

```typescript
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class MyPage extends BasePage {
  // Locators are readonly class properties
  readonly myElement: Locator;
  readonly anotherElement: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.myElement = page.locator('[data-testid="my-element"]');
    this.anotherElement = page.getByRole('button', { name: /submit/i });
  }

  // Methods represent user actions
  async clickMyElement(): Promise<void> {
    await this.myElement.click();
  }

  // Methods may return data
  async getHeadingText(): Promise<string> {
    return (await this.page.locator('h1').first().textContent())?.trim() ?? '';
  }
}
```

## Assertions

- **No `expect()` inside page object methods** — assertions live in test files only
- Methods return `Promise<void>`, `Promise<string>`, `Promise<boolean>`, or `Promise<Locator[]>`

## Import Aliases

Use these tsconfig path aliases (do **not** use `@types/*` — it conflicts with TypeScript's reserved namespace):

| Alias | Maps to |
|-------|---------|
| `@pages/*` | `src/pages/*` |
| `@stypes/*` | `src/types/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |

```typescript
import type { SiteConfig } from '@stypes/site-config.types'; // correct
import type { SiteConfig } from '@types/site-config.types';  // WRONG — TS error TS6137
```

## Type Safety

- No implicit `any` — every parameter and return value must be typed
- Use `unknown` over `any` when the type truly is unknown
- Use optional chaining (`?.`) and nullish coalescing (`??`) rather than non-null assertions (`!`)
  unless you are certain the value cannot be null

## Locator Strategies (in order of preference)

1. `getByRole()` — most accessible and resilient
2. `getByLabel()` / `getByPlaceholder()` — for form fields
3. `getByText()` — for links and buttons when role isn't enough
4. `locator('[data-testid="..."]')` — for elements with test IDs
5. `locator('[class*="keyword"]')` — CSS class heuristics (last resort)
6. Never use absolute XPath or positional `nth-child` selectors

## Exports

Export every class from its own file. No barrel exports (`index.ts`) unless already present.
