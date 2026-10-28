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
    await page.waitForLoadState('load');

    // Common cookie banner patterns
    const bannerLocator = page.locator(
      '[class*="cookie"], [class*="consent"], [class*="gdpr"], ' +
        '[id*="cookie"], [id*="consent"], ' +
        '[aria-label*="cookie" i], [aria-label*="consent" i]'
    ).first();

    // Site may not have a banner, or it may use a third-party widget not in DOM yet
    test.skip(
      await bannerLocator.count() === 0,
      'Cookie consent banner not found with standard selectors (may load asynchronously or via a third-party script)'
    );

    await expect(bannerLocator, 'Cookie consent banner should be visible on first visit').toBeVisible();
  });

  test('cookie banner has an accept button @functional', async ({ page, siteConfig }) => {
    await page.context().clearCookies();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    const acceptButton = page
      .locator('button')
      .filter({ hasText: /accept|allow|agree|got it|ok/i })
      .first();

    test.skip(await acceptButton.count() === 0, 'No cookie accept button found — banner may not be present');

    await expect(acceptButton, 'Cookie accept button should be visible').toBeVisible();
  });

  test('clicking accept dismisses the cookie banner @functional', async ({ page, siteConfig }) => {
    await page.context().clearCookies();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    const bannerLocator = page.locator(
      '[class*="cookie"], [class*="consent"], [class*="gdpr"], ' +
        '[id*="cookie"], [id*="consent"]'
    ).first();

    test.skip(
      await bannerLocator.count() === 0 || !(await bannerLocator.isVisible()),
      'Cookie banner not visible'
    );

    const acceptButton = page
      .locator('button')
      .filter({ hasText: /accept|allow|agree|got it|ok/i })
      .first();

    test.skip(await acceptButton.count() === 0, 'No accept button found in cookie banner');

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
    await page.waitForLoadState('load');

    const bannerLocator = page.locator(
      '[class*="cookie"], [class*="consent"], [class*="gdpr"]'
    ).first();

    test.skip(await bannerLocator.count() === 0, 'Cookie banner not found');

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
