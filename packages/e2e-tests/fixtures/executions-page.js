const path = require('node:path');
const { BasePage } = require('./base-page');

export class ExecutionsPage extends BasePage {
  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('executions', plainPath);

    return await super.screenshot({ path: computedPath, ...restOptions });
  }
}
