const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);
// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      browser: process.env.BROWSER || 'chromium',
      url: 'https://martin-kregar.celtra.com/explorer/1df8d540',
      show: false,
      disableScreenshots: true
    },
    REST: {
      endpoint: 'https://hub.celtra.com/api',
      defaultHeaders: {
        'Content-Type': 'application/json',
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'celtra_assignment',
  
  // Parallel execution multiple browsers
  multiple: {
    parallel: {
      browsers: ['chromium', 'firefox'],
          chunks: 2,
      chromium: {
        browser: 'chromium',
        show: false
      },
      firefox: {
        browser: 'firefox',
        show: false
      }
    }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: false
    }
  }
};