const { BasePage } = require('../../base-page');

export class AddMattermostConnectionModal extends BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor (page) {
    super(page);
    this.clientIdInput = page.getByTestId('clientId-text');
    this.clientIdSecretInput = page.getByTestId('clientSecret-text');
    this.instanceUrlInput = page.getByTestId("instanceUrl-text");
    this.submitButton = page.getByTestId('create-connection-button');
  }

  async fillConnectionForm() {
    await this.instanceUrlInput.fill('https://mattermost.com');
    await this.clientIdInput.fill('aaa');
    await this.clientIdSecretInput.fill('bbb');
  }

  async submitConnectionForm() {
    await this.submitButton.click();
  }
}