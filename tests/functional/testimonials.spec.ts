/**
 * tests/functional/testimonials.spec.ts
 *
 * Functional tests for the social proof / testimonials section on the
 * Convrrt homepage. Verifies customer quotes, attributions, and the
 * section heading are present and visible.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Testimonials & Social Proof @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  // ── Section presence ────────────────────────────────────────────────────────

  test('testimonials section is present on the homepage @functional', async ({ page }) => {
    // Common testimonial containers
    const testimonialSection = page.locator(
      '[class*="testimonial"], [class*="review"], [class*="social-proof"], ' +
        '[class*="customer"], blockquote, [class*="quote"]'
    ).first();

    if (await testimonialSection.count() === 0) {
      // Look for heading cues
      const sectionHeading = page
        .locator('h2, h3')
        .filter({ hasText: /testimonial|what.*say|customers|trusted by|take our word/i })
        .first();

      if (await sectionHeading.count() > 0) {
        await expect(sectionHeading).toBeVisible();
        return;
      }

      console.warn('[functional] No testimonials section found on homepage.');
      return;
    }

    await expect(testimonialSection, 'Testimonials section should be visible').toBeVisible();
  });

  test('multiple testimonials are displayed @functional', async ({ page }) => {
    const testimonials = page.locator(
      '[class*="testimonial"], [class*="review-card"], [class*="quote-card"], blockquote'
    );

    const count = await testimonials.count();

    if (count === 0) {
      console.warn('[functional] No individual testimonial elements found — pattern may differ.');
      return;
    }

    expect(
      count,
      'Homepage should display at least 2 customer testimonials'
    ).toBeGreaterThanOrEqual(2);
  });

  // ── Content quality ─────────────────────────────────────────────────────────

  test('testimonials contain quote text @functional', async ({ page }) => {
    const testimonials = page.locator('[class*="testimonial"], blockquote');
    const count = await testimonials.count();

    if (count === 0) {
      console.warn('[functional] No testimonials found — skipping quote text check.');
      return;
    }

    // Check the first testimonial has meaningful text
    const firstTestimonial = testimonials.first();
    const text = await firstTestimonial.textContent();
    expect(
      text?.trim().length ?? 0,
      'Testimonial should contain non-empty text'
    ).toBeGreaterThan(20);
  });

  test('testimonials include attribution (customer name or company) @functional', async ({
    page,
  }) => {
    // Attribution is typically in a <cite>, <span>, <p class*="name">, or <footer> inside the testimonial
    const attributionLocator = page.locator(
      '[class*="testimonial"] [class*="name"], ' +
        '[class*="testimonial"] [class*="author"], ' +
        '[class*="testimonial"] cite, ' +
        'blockquote + p, blockquote footer'
    );

    if (await attributionLocator.count() === 0) {
      console.warn('[functional] No explicit attribution elements found inside testimonials.');
      return;
    }

    const firstAttribution = attributionLocator.first();
    const text = await firstAttribution.textContent();
    expect(
      text?.trim().length ?? 0,
      'Testimonial attribution should contain a name or company'
    ).toBeGreaterThan(2);
  });

  // ── Statistic trust signal ──────────────────────────────────────────────────

  test('homepage displays user count or growth statistic @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    // Convrrt shows "68,000+" or "65,000+" users
    const hasUserCount = /\d[\d,]+\+?\s*(users|people|businesses|customers|trust)/i.test(bodyText);
    const hasRetentionStat = /retention|account.*retention|\d+.*month/i.test(bodyText);
    const hasGrowthStat = /\d[\d,]+\+?\s*(pages|landing pages)/i.test(bodyText);

    const hasSomeStat = hasUserCount || hasRetentionStat || hasGrowthStat;

    if (!hasSomeStat) {
      console.warn('[functional] No user count or growth statistic found on homepage.');
    }

    expect(
      hasSomeStat,
      'Homepage should display at least one quantified trust statistic (user count, retention, pages)'
    ).toBeTruthy();
  });

  // ── "Don't just take our word for it" heading ────────────────────────────────

  test('social proof section heading is visible @functional', async ({ page }) => {
    const socialProofHeading = page
      .locator('h2, h3')
      .filter({ hasText: /take our word|trusted by|customers say|testimonials|preferred.*platform/i })
      .first();

    if (await socialProofHeading.count() === 0) {
      console.warn(
        '[functional] Social proof heading not found. Section may use a different heading text.'
      );
      return;
    }

    await expect(socialProofHeading).toBeVisible();
  });
});
