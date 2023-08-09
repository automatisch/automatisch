const base = require('@playwright/test');
const { ApplicationsPage } = require('./applications-page');

exports.test = base.test.extend({
  applicationsPage: async ({ page }, use) => {
    await use(new ApplicationsPage(page));
  },
});
exports.expect = base.expect;
