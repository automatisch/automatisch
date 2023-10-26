const { test, expect } = require('@playwright/test');
const { ApplicationsPage } = require('./applications-page');
const { ConnectionsPage } = require('./connections-page');
const { ExecutionsPage } = require('./executions-page');
const { FlowEditorPage } = require('./flow-editor-page');
const { UserInterfacePage } = require('./user-interface-page');
const { LoginPage } = require('./login-page');
const { adminFixtures } = require('./admin');

exports.test = test.extend({
  page: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();

    await expect(loginPage.loginButton).not.toBeVisible();
    await expect(page).toHaveURL('/flows');

    await use(page);
  },
  applicationsPage: async ({ page }, use) => {
    await use(new ApplicationsPage(page));
  },
  connectionsPage: async ({ page }, use) => {
    await use(new ConnectionsPage(page));
  },
  executionsPage: async ({ page }, use) => {
    await use(new ExecutionsPage(page));
  },
  flowEditorPage: async ({ page }, use) => {
    await use(new FlowEditorPage(page));
  },
  userInterfacePage: async ({ page }, use) => {
    await use(new UserInterfacePage(page));
  },
  ...adminFixtures
});

exports.publicTest = test.extend({
  page: async ({ page }, use) => {
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await use(loginPage);
  },
});

expect.extend({
  toBeClickableLink: async (locator) => {
    await expect(locator).not.toHaveAttribute('aria-disabled', 'true');

    return { pass: true };
  },
});

exports.expect = expect;
