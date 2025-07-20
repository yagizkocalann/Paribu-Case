const { Before, After } = require('@cucumber/cucumber');

Before(async function (scenario) {
  console.log('🎬 Scenario started');
  if (!scenario.pickle.uri.includes('features/api/')) {
    await this.launchBrowser();
    const page = this.page;
    try {
      const session = await page.context().newCDPSession(page);
      await session.send('Browser.setWindowBounds', {
        windowId: (await session.send('Browser.getWindowForTarget')).windowId,
        bounds: { windowState: 'maximized' }
      });
    } catch (err) {
      console.warn('🔍 Fullscreen not supported in this browser:', err.message);
    }
  }
});

After(async function () {
  console.log('✅ Scenario finished');
  await this.closeBrowser();
});