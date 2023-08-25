const path = require('node:path');
const { AuthenticatedPage } = require('./authenticated-page');

export class ConnectionsPage extends AuthenticatedPage {
  screenshotPath = '/connections';

  async clickAddConnectionButton() {
    await this.page.getByTestId('add-connection-button').click();
  }
}
