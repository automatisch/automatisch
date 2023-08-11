const path = require('node:path');
const { BasePage } = require('./base-page');

export class ConnectionsPage extends BasePage {
  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('connections', plainPath);

    return await super.screenshot({ path: computedPath, ...restOptions });
  }

  async clickAddConnectionButton() {
    await this.page.getByTestId('add-connection-button').click();
  }
}
