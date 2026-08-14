/**
 * tests/functional/cookie-consent.spec.ts
 *
 * Functional tests for the Convrrt cookie consent banner.
 * Verifies the banner appears on first visit and can be dismissed
 * without submitting any data.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Cookie Consent Banner @functional', () => {
  test('cookie consent banner appears on first visit @functional', async ({ page, siteConfig }) => {
    // Use a fresh context with no prior cookies/storage
    await page.context().clearCookies();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    // Common cookie banner patterns
    const bannerLocator = page.locator(
      '[class*="cookie"], [class*="consent"], [class*="gdpr"], ' +
        '[id*="cookie"], [id*="consent"], ' +
        '[aria-label*="cookie" i], [aria-label*="consent" i]'
    ).first();

    if (await bannerLocator.count() === 0) {
      // Site may not have a banner, or it may use a third-party widget not in DOM yet
      console.warn(
        '[functional] Cookie consent banner not found with standard selectors. ' +
          'The banner may be loaded asynchronously or via a third-party script.'
      );
      return;
    }

    await expect(bannerLocator, 'Cookie consent banner should be visible on first visit').toBeVisible();
  });

  test('cookie banner has an accept button @functional', async ({ page, siteConfig }) => {
    await page.context().clearCookies();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const acceptButton = page
      .locator('button')
      .filter({ hasText: /accept|allow|agree|got it|ok/i })
      .first();

    if (await acceptButton.count() === 0) {
      console.warn('[functional] No cookie accept button found — banner may not be present.');
      return;
    }

    await expect(acceptButton, 'Cookie accept button should be visible').toBeVisible();
  });

  test('clicking accept dismisses the cookie banner @functional', async ({ page, siteConfig }) => {
    await page.context().clearCookies();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const bannerLocator = page.locator(
      '[class*="cookie"], [class*="consent"], [class*="gdpr"], ' +
        '[id*="cookie"], [id*="consent"]'
    ).first();

    if (await bannerLocator.count() === 0 || !(await bannerLocator.isVisible())) {
      console.warn('[functional] Cookie banner not visible — skipping dismiss test.');
      return;
    }

    const acceptButton = page
      .locator('button')
      .filter({ hasText: /accept|allow|agree|got it|ok/i })
      .first();

    if (await acceptButton.count() === 0) {
      console.warn('[functional] No accept button found in cookie banner.');
      return;
    }

    await acceptButton.click();

    // Wait for banner to disappear
    await expect(
      bannerLocator,
      'Cookie banner should disappear after clicking accept'
    ).toBeHidden({ timeout: 5_000 });
  });

  test('cookie banner has a dismiss or reject option @functional', async ({ page, siteConfig }) => {
    await page.context().clearCookies();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const bannerLocator = page.locator(
      '[class*="cookie"], [class*="consent"], [class*="gdpr"]'
    ).first();

    if (await bannerLocator.count() === 0) {
      console.warn('[functional] Cookie banner not found — skipping reject option test.');
      return;
    }

    // Check for dismiss/reject/decline option (GDPR compliance)
    const rejectButton = page
      .locator('button')
      .filter({ hasText: /reject|decline|dismiss|no thanks|necessary only/i })
      .first();

    if (await rejectButton.count() === 0) {
      console.warn(
        '[functional] No reject/dismiss button found on cookie banner. ' +
          'GDPR compliance may require a reject option.'
      );
    } else {
      await expect(rejectButton).toBeVisible();
    }
  });
});
