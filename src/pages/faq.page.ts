import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class FaqPage extends BasePage {
  readonly faqSection: Locator;

  constructor(...args: ConstructorParameters<typeof BasePage>) {
    super(...args);
    this.faqSection = this.page
      .locator('section, div')
      .filter({ hasText: /faq|frequently asked questions/i })
      .first();
  }

  // ── FAQ item discovery ──────────────────────────────────────────────────────

  async getFaqTriggers(): Promise<Locator[]> {
    // Try common accordion patterns used on marketing sites
    const candidates = [
      this.page.locator('[class*="faq"] [class*="question"]'),
      this.page.locator('[class*="accordion"] [class*="title"]'),
      this.page.locator('[class*="accordion"] [class*="header"]'),
      this.page.locator('details summary'),
      this.page.locator('[role="button"][aria-expanded]'),
      this.page.locator('[data-accordion-trigger]'),
    ];

    for (const locator of candidates) {
      const count = await locator.count();
      if (count > 0) return locator.all();
    }

    return [];
  }

  async getFaqCount(): Promise<number> {
    const triggers = await this.getFaqTriggers();
    return triggers.length;
  }

  // ── Interaction ─────────────────────────────────────────────────────────────

  async clickFaqItem(index: number): Promise<void> {
    const triggers = await this.getFaqTriggers();
    if (triggers[index]) {
      await triggers[index].click();
    }
  }

  // ── State inspection ────────────────────────────────────────────────────────

  async isFaqItemExpanded(index: number): Promise<boolean> {
    const triggers = await this.getFaqTriggers();
    const trigger = triggers[index];
    if (!trigger) return false;

    const ariaExpanded = await trigger.getAttribute('aria-expanded');
    if (ariaExpanded !== null) return ariaExpanded === 'true';

    // <details> elements use the `open` attribute on the parent
    const isOpenDetail = await trigger.evaluate((el) => {
      const details = el.closest('details');
      return details ? details.hasAttribute('open') : false;
    });
    return isOpenDetail;
  }

  async isFaqSectionVisible(): Promise<boolean> {
    const count = await this.faqSection.count();
    if (count === 0) {
      // Fall back: look for a heading containing "FAQ"
      return (
        (await this.page
          .locator('h2, h3, h4')
          .filter({ hasText: /faq|frequently asked/i })
          .count()) > 0
      );
    }
    return this.faqSection.isVisible();
  }

  // ── Scroll to FAQ ───────────────────────────────────────────────────────────

  async scrollToFaq(): Promise<void> {
    const faqHeading = this.page
      .locator('h2, h3, h4')
      .filter({ hasText: /faq|frequently asked/i })
      .first();

    if (await faqHeading.count() > 0) {
      await faqHeading.scrollIntoViewIfNeeded();
    }
  }
}
