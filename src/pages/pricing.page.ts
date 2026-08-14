import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class PricingPage extends BasePage {
  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigateToPricing(): Promise<void> {
    const pricingUrl = this.url.replace(/\/$/, '') + '/pricing';
    await this.page.goto(pricingUrl, { waitUntil: 'domcontentloaded' });
  }

  // ── Plan cards ──────────────────────────────────────────────────────────────

  async getPricingPlans(): Promise<Locator[]> {
    const candidates = [
      this.page.locator('[class*="plan"]:not([class*="plan-name"])'),
      this.page.locator('[class*="pricing-card"]'),
      this.page.locator('[class*="tier"]'),
      this.page.locator('[class*="package"]'),
      this.page.locator('[class*="price-card"]'),
    ];

    for (const locator of candidates) {
      const count = await locator.count();
      if (count > 1) return locator.all(); // Pricing pages always have >1 plan
    }

    return [];
  }

  async getPlanCount(): Promise<number> {
    const plans = await this.getPricingPlans();
    return plans.length;
  }

  // ── CTAs ────────────────────────────────────────────────────────────────────

  async getPlanCtaButtons(): Promise<Locator[]> {
    const ctaLocator = this.page
      .locator('a, button')
      .filter({ hasText: /get started|sign up|try free|choose|select|start|contact|free trial/i });
    return ctaLocator.all();
  }

  // ── Price display ───────────────────────────────────────────────────────────

  async hasPriceDisplay(): Promise<boolean> {
    // Look for $ signs or "free" price labels
    const priceElements = this.page.locator(
      '[class*="price"], [class*="amount"], [class*="cost"]'
    );

    if (await priceElements.count() > 0) return true;

    // Fallback: check page text for price patterns
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /\$\d|\bfree\b/i.test(bodyText);
  }

  // ── Page load check ─────────────────────────────────────────────────────────

  async isPricingPageLoaded(): Promise<boolean> {
    try {
      const headingCount = await this.page
        .locator('h1, h2')
        .filter({ hasText: /pricing|plans|packages/i })
        .count();
      return headingCount > 0;
    } catch {
      return false;
    }
  }
}
