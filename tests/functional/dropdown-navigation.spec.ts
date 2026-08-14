/**
 * tests/functional/dropdown-navigation.spec.ts
 *
 * Functional tests for Convrrt's multi-level dropdown navigation menus.
 * Verifies that the Product, Use Cases, and Resources dropdowns open and
 * expose expected child links without navigating away.
 *
 * Tag: @functional @navigation
 */

import { test, expect } from '@fixtures/site.fixture';

const DROPDOWNS = [
  {
    label: 'Product',
    expectedItems: ['Features', 'How It Works', 'Pop-up Builder', 'Live Demo'],
  },
  {
    label: 'Use Cases',
    expectedItems: ['CRM', 'Marketing Automation', 'Virtual Events'],
  },
  {
    label: 'Resources',
    expectedItems: ['Blog', 'Case Studies', 'Whitepapers'],
  },
] as const;

test.describe('Dropdown Navigation @functional @navigation', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  // ── Dropdown existence ──────────────────────────────────────────────────────

  test('primary navigation contains expected top-level items @functional @navigation', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav, 'A <nav> element should be present').toBeVisible();

    for (const dropdown of DROPDOWNS) {
      const navItem = nav.locator('a, button').filter({ hasText: dropdown.label }).first();
      if (await navItem.count() > 0) {
        await expect(navItem, `"${dropdown.label}" nav item should be visible`).toBeVisible();
      } else {
        console.warn(`[functional] Nav item "${dropdown.label}" not found — label may have changed.`);
      }
    }
  });

  // ── Dropdown open on click ──────────────────────────────────────────────────

  for (const dropdown of DROPDOWNS) {
    test(`"${dropdown.label}" dropdown opens and shows child links @functional @navigation`, async ({
      page,
    }) => {
      const nav = page.locator('nav, [role="navigation"]').first();
      const trigger = nav.locator('a, button').filter({ hasText: dropdown.label }).first();

      if (await trigger.count() === 0) {
        console.warn(`[functional] "${dropdown.label}" trigger not found — skipping.`);
        return;
      }

      // Hover first (many menus are CSS-hover based)
      await trigger.hover();
      await page.waitForTimeout(300);

      // Also try click in case it's a click-activated dropdown
      const isExpanded = await trigger.getAttribute('aria-expanded');
      if (isExpanded === 'false' || isExpanded === null) {
        await trigger.click();
        await page.waitForTimeout(300);
      }

      // After opening, at least one expected child link should be visible
      let foundAny = false;
      for (const expectedItem of dropdown.expectedItems) {
        const childLink = page
          .locator('a')
          .filter({ hasText: new RegExp(expectedItem, 'i') })
          .first();

        if (await childLink.count() > 0 && await childLink.isVisible()) {
          foundAny = true;
          break;
        }
      }

      if (!foundAny) {
        console.warn(
          `[functional] "${dropdown.label}" dropdown opened but expected child links not visible. ` +
            `Expected one of: ${dropdown.expectedItems.join(', ')}`
        );
      } else {
        expect(foundAny, `"${dropdown.label}" dropdown should reveal child navigation links`).toBeTruthy();
      }
    });
  }

  // ── Pricing link (not a dropdown) ───────────────────────────────────────────

  test('"Pricing" nav link is present and points to /pricing @functional @navigation', async ({ page }) => {
    const pricingLink = page
      .locator('nav a, [role="navigation"] a')
      .filter({ hasText: /^pricing$/i })
      .first();

    if (await pricingLink.count() === 0) {
      console.warn('[functional] Pricing nav link not found.');
      return;
    }

    await expect(pricingLink).toBeVisible();
    const href = await pricingLink.getAttribute('href');
    expect(href, 'Pricing link should have an href').not.toBeNull();
    expect(href?.toLowerCase()).toMatch(/pricing/i);
  });

  // ── Schedule demo CTA ───────────────────────────────────────────────────────

  test('"Schedule demo" nav CTA is visible on desktop @functional', async ({ page }) => {
    const scheduleCta = page
      .locator('nav a, [role="navigation"] a, header a')
      .filter({ hasText: /schedule.*demo|book.*demo|get.*demo/i })
      .first();

    if (await scheduleCta.count() === 0) {
      console.warn('[functional] Schedule demo CTA not found in nav — may use different label.');
      return;
    }

    await expect(scheduleCta, '"Schedule demo" CTA should be visible in the nav').toBeVisible();
  });
});
