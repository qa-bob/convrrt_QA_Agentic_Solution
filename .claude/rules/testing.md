---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Test File Rules

These rules apply when Claude is writing or editing files under `tests/`.

## Imports

Always import from the custom fixture, never from `@playwright/test` directly:

```typescript
// Correct
import { test, expect } from '@fixtures/site.fixture';

// Wrong — do not do this
import { test, expect } from '@playwright/test';
```

## Tags

Every `test()` call must include at least one tag in its title string:

```typescript
test('hero heading is visible @smoke @functional', async ({ page }) => { ... });
```

Valid tags: `@smoke` `@navigation` `@forms` `@functional` `@visual` `@responsive` `@custom`

## Selectors

- Use page object methods and properties — do not call `page.locator()` directly in the test body
- If a selector isn't on the page object, add it to the page object first, then use it in the test

## Waits

- Use `await expect(locator).toBeVisible()` — never `page.waitForTimeout()`
- Playwright's auto-waiting handles most cases; only add explicit waits for race conditions

## Form Safety

- Never click a submit button without intercepting navigation first
- Never enter real email addresses or personally identifiable information
- Test field interactions and validation only — no actual submission

## Test Independence

- Each test must be able to run in isolation — no shared state between tests
- Use `test.beforeEach` for navigation, not `test.beforeAll`
- Do not rely on test ordering
