const path = require('node:path');
const { BasePage } = require('./base-page');

export class ApplicationsPage extends BasePage {
  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('applications', plainPath);

    return await super.screenshot({ path: computedPath, ...restOptions });
  }
}
