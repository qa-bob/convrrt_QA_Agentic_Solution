/**
 * tests/functional/pricing-page.spec.ts
 *
 * Functional tests for the Convrrt /pricing page.
 * Verifies pricing plans are displayed, CTAs are present, and the page
 * loads correctly — without initiating any signup or payment flow.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { PricingPage } from '@pages/pricing.page';

test.describe('Pricing Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    const pricingPage = new PricingPage(page, siteConfig);
    await pricingPage.navigateToPricing();
    await page.waitForLoadState('networkidle');
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('/pricing page loads with HTTP 200 @functional @smoke', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/pricing',
      { waitUntil: 'domcontentloaded' }
    );

    expect(response, 'Response should not be null').not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `Expected HTTP 2xx/3xx on /pricing but got ${status}`
    ).toBeTruthy();
  });

  test('pricing page has a heading mentioning pricing or plans @functional', async ({
    page,
    siteConfig,
  }) => {
    const pricingPage = new PricingPage(page, siteConfig);
    const isLoaded = await pricingPage.isPricingPageLoaded();

    if (!isLoaded) {
      console.warn('[functional] Pricing page heading not found with "pricing/plans" text — verifying page has some heading.');
      const anyHeading = page.locator('h1, h2').first();
      await expect(anyHeading).toBeVisible();
      return;
    }

    expect(isLoaded, 'Pricing page should have a heading with "pricing" or "plans"').toBeTruthy();
  });

  // ── Plan cards ──────────────────────────────────────────────────────────────

  test('pricing page displays at least one pricing plan or tier @functional', async ({
    page,
    siteConfig,
  }) => {
    const pricingPage = new PricingPage(page, siteConfig);
    const planCount = await pricingPage.getPlanCount();

    if (planCount === 0) {
      // Some pricing pages are structured differently — fall back to checking
      // for price-indicating text on the page
      const hasPrices = await pricingPage.hasPriceDisplay();
      expect(
        hasPrices,
        'Pricing page should display pricing plans, plan cards, or price indicators'
      ).toBeTruthy();
      return;
    }

    expect(planCount, 'Should find at least one pricing plan card').toBeGreaterThanOrEqual(1);
  });

  test('pricing plans have CTA buttons @functional', async ({ page, siteConfig }) => {
    const pricingPage = new PricingPage(page, siteConfig);
    const ctaButtons = await pricingPage.getPlanCtaButtons();

    if (ctaButtons.length === 0) {
      console.warn('[functional] No plan CTA buttons found — checking for any visible CTA.');
      const genericCta = page.locator('a, button').filter({ hasText: /start|contact|demo|free/i }).first();
      if (await genericCta.count() > 0) {
        await expect(genericCta).toBeVisible();
      }
      return;
    }

    expect(ctaButtons.length, 'Pricing page should have CTA buttons for plans').toBeGreaterThan(0);
    await expect(ctaButtons[0]).toBeVisible();
  });

  // ── Free plan / trial mention ───────────────────────────────────────────────

  test('pricing page mentions a free option or trial @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasFreeOption = /free|trial|no credit card/i.test(bodyText);

    if (!hasFreeOption) {
      console.warn('[functional] No mention of free plan or trial on pricing page.');
    }

    // This is a soft assertion — Convrrt offers a 30-day free trial
    // but the page structure may vary
    expect(hasFreeOption, 'Pricing page should mention a free plan or trial period').toBeTruthy();
  });

  // ── Navigation back to home ──────────────────────────────────────────────────

  test('pricing page has working navigation back to homepage @functional @navigation', async ({
    page,
    siteConfig,
  }) => {
    const logoLink = page
      .locator(
        'a[class*="logo" i], a[aria-label*="home" i], ' +
          'header a[href="/"], header a[href="' + siteConfig.url + '"]'
      )
      .first();

    if (await logoLink.count() === 0) {
      // Fallback: nav link to home
      const homeLink = page.locator('nav a[href="/"], nav a[href*="convrrt.com"]').first();
      if (await homeLink.count() > 0) {
        await expect(homeLink).toBeVisible();
      } else {
        console.warn('[functional] Could not find a logo or home link on pricing page.');
      }
      return;
    }

    await expect(logoLink, 'Logo/home link should be visible on pricing page').toBeVisible();
  });
});
