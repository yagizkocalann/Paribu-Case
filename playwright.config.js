const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: ['--incognito'],
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
        outputDir: 'reports/chromium',
      },
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
        outputDir: 'reports/firefox',
      },
    },
    {
      name: 'Edge',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
        outputDir: 'reports/edge',
      },
    },
  ],
});