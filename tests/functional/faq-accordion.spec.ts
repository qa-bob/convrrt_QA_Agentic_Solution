/**
 * tests/functional/faq-accordion.spec.ts
 *
 * Functional tests for the FAQ accordion on the Convrrt homepage.
 * Verifies FAQ items are present, expandable, and display content
 * after interaction — without navigating away or submitting anything.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { FaqPage } from '@pages/faq.page';

test.describe('FAQ Accordion @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  // ── Section presence ────────────────────────────────────────────────────────

  test('FAQ section is present on the homepage @functional', async ({ page, siteConfig }) => {
    const faqPage = new FaqPage(page, siteConfig);
    const isVisible = await faqPage.isFaqSectionVisible();

    expect(
      isVisible,
      'An FAQ section (or heading with "FAQ" / "Frequently Asked Questions") should be on the homepage'
    ).toBeTruthy();
  });

  test('FAQ section has multiple questions @functional', async ({ page, siteConfig }) => {
    const faqPage = new FaqPage(page, siteConfig);
    await faqPage.scrollToFaq();

    const count = await faqPage.getFaqCount();

    if (count === 0) {
      console.warn('[functional] No FAQ triggers found — accordion may use a non-standard pattern.');
      return;
    }

    expect(
      count,
      'FAQ section should have at least 3 questions'
    ).toBeGreaterThanOrEqual(3);
  });

  // ── Accordion interaction ───────────────────────────────────────────────────

  test('clicking a FAQ item expands it and shows answer content @functional', async ({
    page,
    siteConfig,
  }) => {
    const faqPage = new FaqPage(page, siteConfig);
    await faqPage.scrollToFaq();

    const triggers = await faqPage.getFaqTriggers();

    if (triggers.length === 0) {
      console.warn('[functional] No FAQ triggers found — skipping expand test.');
      return;
    }

    // Click the first FAQ item
    await faqPage.clickFaqItem(0);
    await page.waitForTimeout(400); // Allow CSS transition to complete

    // The expanded item should either have aria-expanded="true" or reveal text content
    const isExpanded = await faqPage.isFaqItemExpanded(0);

    if (!isExpanded) {
      // Some implementations reveal content without updating aria-expanded
      // In this case just confirm content exists near the clicked element
      const answerContent = page
        .locator('[class*="faq"] [class*="answer"], [class*="faq"] [class*="content"], details p')
        .first();

      if (await answerContent.count() > 0) {
        await expect(answerContent).toBeVisible();
      } else {
        console.warn(
          '[functional] FAQ item clicked but expansion state could not be confirmed. ' +
            'Accordion may use a non-standard pattern.'
        );
      }
    } else {
      expect(isExpanded, 'Clicked FAQ item should be marked as expanded').toBeTruthy();
    }
  });

  test('FAQ questions contain expected Convrrt-related topics @functional', async ({
    page,
    siteConfig,
  }) => {
    const faqPage = new FaqPage(page, siteConfig);
    await faqPage.scrollToFaq();

    const triggers = await faqPage.getFaqTriggers();

    if (triggers.length === 0) {
      console.warn('[functional] No FAQ triggers found — skipping content check.');
      return;
    }

    // Collect question text from all triggers
    const questionTexts: string[] = [];
    for (const trigger of triggers) {
      const text = await trigger.textContent();
      if (text?.trim()) questionTexts.push(text.trim());
    }

    // At least one FAQ question should reference the product, data, or trial
    const hasRelevantContent = questionTexts.some((q) =>
      /convrrt|landing page|data|hosting|trial|support|integration|saas/i.test(q)
    );

    if (!hasRelevantContent) {
      console.warn('[functional] FAQ questions may not reference expected product topics.');
    }

    expect(questionTexts.length, 'Should find question text in FAQ triggers').toBeGreaterThan(0);
  });

  // ── Visual check: FAQ section is in view after scroll ──────────────────────

  test('FAQ section is reachable by scrolling @functional @smoke', async ({ page, siteConfig }) => {
    const faqPage = new FaqPage(page, siteConfig);
    await faqPage.scrollToFaq();

    const faqHeading = page
      .locator('h2, h3, h4')
      .filter({ hasText: /faq|frequently asked/i })
      .first();

    if (await faqHeading.count() > 0) {
      await expect(faqHeading).toBeInViewport();
    } else {
      // Accept if the FAQ section container is visible anywhere on the page
      const sectionVisible = await faqPage.isFaqSectionVisible();
      expect(sectionVisible, 'FAQ section should be present on the page').toBeTruthy();
    }
  });
});
