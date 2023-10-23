import { GithubPopup } from './github-popup';

const { BasePage } = require('../../base-page');

export class AddGithubConnectionModal extends BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor (page) {
    super(page);
    this.modal = page.getByTestId('add-app-connection-dialog');
    this.oauthRedirectInput = page.getByTestId('oAuthRedirectUrl-text');
    this.clientIdInput = page.getByTestId('consumerKey-text');
    this.clientIdSecretInput = page.getByTestId('consumerSecret-text');
    this.submitButton = page.getByTestId('create-connection-button');
  }

  async visible () {
    return await this.modal.isVisible();
  }

  async inputForm () {
    await connectionModal.clientIdInput.fill(
      process.env.GITHUB_CLIENT_ID
    );
    await connectionModal.clientIdSecretInput.fill(
      process.env.GITHUB_CLIENT_SECRET
    );
  }

  /**
   * @returns {import('@playwright/test').Page}
   */
  async submit () {
    const popupPromise = this.page.waitForEvent('popup');
    await this.submitButton.click();
    const popup = await popupPromise;
    await popup.bringToFront();
    return popup;
  }

  /**
   * @param {import('@playwright/test').Page} page
   */
  async handlePopup (page) {
    return await GithubPopup.handle(page);
  }
}