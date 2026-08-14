---
name: Feature / test coverage request
about: Request new test coverage for a Convrrt feature or page
title: "[FEATURE] "
labels: enhancement
assignees: ''
---

## Feature to test

<!-- What page or feature should be covered? -->

**Page / URL:** `https://www.convrrt.com/...`
**Feature:** e.g. "FAQ accordion", "Pricing page plan cards", "Demo booking CTA"

---

## Why this matters

<!-- What user flow or risk does this protect? -->

---

## Proposed test scenarios

<!-- List the specific assertions or flows you want covered -->

- [ ] Scenario 1: ...
- [ ] Scenario 2: ...
- [ ] Scenario 3: ...

---

## Suggested tag

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

---

## Acceptance criteria

<!-- How will you know the tests are adequate? -->

- [ ] All listed scenarios have a passing test
- [ ] New page object methods added for any new selectors
- [ ] `npx tsc --noEmit` and `npm run lint` pass
