const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

class CustomWorld {
  constructor() {
    this.token = null;
    this.response = null;
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async launchBrowser() {
    const browserType = process.env.BROWSER || 'chromium';
    const { chromium, firefox, webkit } = require('playwright');
    if (browserType === 'firefox') {
      this.browser = await firefox.launch({ headless: false });
    } else if (browserType === 'webkit') {
      this.browser = await webkit.launch({ headless: false });
    } else {
      this.browser = await chromium.launch({ headless: false });
    }
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);