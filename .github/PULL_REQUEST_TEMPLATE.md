## Summary

<!--
Describe what changed and why. Link the issue this resolves if applicable.
Example: "Adds functional tests for the FAQ accordion on the Convrrt homepage."
-->

Closes #

---

## Type of change

- [ ] New test(s)
- [ ] Updated test(s) / selector fix
- [ ] New page object / updated page object
- [ ] CI / config change
- [ ] Documentation update
- [ ] Bug fix in test infrastructure

---

## Test coverage

<!-- Which test tags does this PR affect? -->

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

---

## Pre-merge checklist

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] New tests include at least one tag (`@smoke`, `@functional`, etc.)
- [ ] No hardcoded URLs — `baseURL` is used from Playwright config
- [ ] No form submissions — tests only interact with fields, not submit
- [ ] No `page.waitForTimeout()` calls introduced
- [ ] Page object locators are defined on the class, not inline in test bodies
- [ ] Visual baseline updated if `@visual` tests were changed (`npm run baseline`)
- [ ] `site.config.json` updated if site structure changed

---

## How to test locally

```bash
# Run all tests
npm test

# Run only the affected tag
npm run test:smoke        # or :navigation, :forms, :functional, :visual, :responsive

# Headed mode for debugging
npx playwright test --headed --grep @functional
```
