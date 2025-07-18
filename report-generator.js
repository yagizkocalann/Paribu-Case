const report = require('multiple-cucumber-html-reporter');

// We install npm-run-all to run tests in parallel for different browsers.
// Using a shared output directory ('reports') for all browsers simplifies report generation by consolidating all test results in one place.
report.generate({
  jsonDir: './reports',
  reportPath: './reports/html',
  metadata:{
    browser: { name: 'chrome', version: '114' },
    device: 'Local test machine',
    platform: { name: 'macOS', version: 'Ventura' }
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'Paribu Case' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Execution Start Time', value: new Date().toLocaleString() }
    ]
  }
});