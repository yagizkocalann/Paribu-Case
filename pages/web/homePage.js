const { expect } = require('@playwright/test');
const { WebUrl } = require('../../config/env');

class HomePage {
  constructor(page) {
    if (!page) {
      throw new Error('A valid page instance must be provided to HomePage');
    }
    this.page = page;
    this.cookieCloseButton = this.page.getByRole('button', { name: 'Tüm çerezleri kabul et' });
    this.marketsNavLink = this.page.getByRole('link', { name: /Piyasalar/ });
  }

  async goto() {
    await this.page.goto(WebUrl, { waitUntil: 'domcontentloaded' });
    await this.assertPageLoaded();
  }

  async waitForCookieButton() {
    await this.cookieCloseButton.waitFor({ state: 'visible', timeout: 5000 });
  }

  async closeCookies() {
    try {
      await this.cookieCloseButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.cookieCloseButton.click();
    } catch (error) {
      console.warn('Cookie close button not found or not visible within timeout.');
    }
  }

  async navigateToMarketsPage() {
    await this.marketsNavLink.click();
    await this.page.waitForURL(/\/markets/, { timeout: 10000 });
  }

  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/paribu\.com/);
    await expect(this.cookieCloseButton).toBeVisible();
  }
}

module.exports = HomePage;