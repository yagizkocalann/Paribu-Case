const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    headless: false,
    viewport: null,
    launchOptions: {
      args: ['--incognito', '--start-maximized'],
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