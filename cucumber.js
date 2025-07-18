module.exports = {
    default: {
      require: [
        'step-definitions/**/*.js',
        'support/hooks.js',
        'support/world.js'
      ],
      format: ['progress', 'json:reports/report.json'],
      publishQuiet: true
    }
  };