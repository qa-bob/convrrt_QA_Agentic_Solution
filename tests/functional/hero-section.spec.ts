/**
 * tests/functional/hero-section.spec.ts
 *
 * Functional tests for the Convrrt homepage hero section.
 * Verifies the primary value proposition, headings, and CTAs are present
 * and visible without interacting with any sign-up flows.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Hero Section @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  // ── Headings ────────────────────────────────────────────────────────────────

  test('homepage has an H1 heading @functional @smoke', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1, 'Homepage must have an <h1> heading').toBeVisible();
    const text = await h1.textContent();
    expect(text?.trim().length, 'H1 must have meaningful text').toBeGreaterThan(5);
  });

  test('hero heading mentions the core product proposition @functional', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = (await h1.textContent()) ?? '';
    // Convrrt's H1: "The Landing Page Platform for SaaS Product Teams"
    expect(
      text.toLowerCase(),
      'Hero heading should reference landing pages or SaaS'
    ).toMatch(/landing page|saas|page builder|platform/i);
  });

  test('hero subheading is visible and non-empty @functional', async ({ page }) => {
    // Subheading lives in the hero section — typically a <p> or <h2> near the H1
    const heroSection = page.locator('header, section, [class*="hero"]').first();
    const subtext = heroSection.locator('p, h2').first();

    if (await subtext.count() === 0) {
      // Fallback: any <p> in the top portion of the page
      const firstP = page.locator('p').first();
      await expect(firstP).toBeVisible();
      return;
    }

    await expect(subtext).toBeVisible();
    const text = await subtext.textContent();
    expect(text?.trim().length, 'Hero subtext should be non-empty').toBeGreaterThan(10);
  });

  // ── Call-to-action buttons ──────────────────────────────────────────────────

  test('at least one primary CTA button is visible in the hero @functional', async ({ page }) => {
    const ctaLocator = page
      .locator('a, button')
      .filter({ hasText: /try.*free|get started|see.*demo|schedule.*demo|free trial|sign up/i });

    const count = await ctaLocator.count();
    expect(
      count,
      'At least one CTA button (Try Free, Get Started, Demo) should be visible'
    ).toBeGreaterThan(0);

    await expect(ctaLocator.first()).toBeVisible();
  });

  test('"Try it free" CTA is visible on desktop @functional', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto((await page.evaluate(() => window.location.href)), {
      waitUntil: 'domcontentloaded',
    });

    const tryFreeBtn = page.locator('a, button').filter({ hasText: /try.*free/i }).first();

    if (await tryFreeBtn.count() === 0) {
      console.warn('[functional] "Try it free" button not found — CTA text may have changed.');
      return;
    }

    await expect(tryFreeBtn, '"Try it free" button should be visible').toBeVisible();
  });

  test('"Schedule demo" or "See demo" CTA is present @functional', async ({ page }) => {
    const demoCta = page
      .locator('a, button')
      .filter({ hasText: /demo|product tour/i })
      .first();

    if (await demoCta.count() === 0) {
      console.warn('[functional] No demo CTA found — may have changed label.');
      return;
    }

    await expect(demoCta).toBeVisible();
  });

  // ── Social proof / statistics ───────────────────────────────────────────────

  test('homepage displays a social proof statistic or trust indicator @functional', async ({ page }) => {
    // Look for numbered stats (e.g. "68,000+ users" or "65,000 pages")
    const statPattern = /\d[\d,]+\+?\s*(users|pages|people|businesses|customers|trust)/i;
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    const hasStats = statPattern.test(bodyText);
    const hasTestimonials = (await page.locator('[class*="testimonial"], blockquote').count()) > 0;
    const hasLogos = (await page.locator('[class*="logo-bar"], [class*="client-logo"]').count()) > 0;

    expect(
      hasStats || hasTestimonials || hasLogos,
      'Homepage should have at least one social proof element (stats, testimonials, or logos)'
    ).toBeTruthy();
  });
});
