const base = require('@playwright/test');
const { ApplicationsPage } = require('./applications-page');
const { ConnectionsPage } = require('./connections-page');
const { ExecutionsPage } = require('./executions-page');
const { FlowEditorPage } = require('./flow-editor-page');

exports.test = base.test.extend({
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
});
exports.expect = base.expect;
