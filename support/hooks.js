const { Before, After } = require('@cucumber/cucumber');

Before(async function (scenario) {
  console.log('🎬 Scenario started');
  if (!scenario.pickle.uri.includes('features/api/')) {
    await this.launchBrowser();
  }
});

After(async function () {
  console.log('✅ Scenario finished');
  await this.closeBrowser();
});