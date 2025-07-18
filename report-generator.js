const report = require('multiple-cucumber-html-reporter');


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