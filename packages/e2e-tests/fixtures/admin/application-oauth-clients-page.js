import { expect } from '@playwright/test';

const { AuthenticatedPage } = require('../authenticated-page');

export class AdminApplicationOAuthClientsPage extends AuthenticatedPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.authClientsTab = this.page.getByTestId('oauth-clients-tab');
    this.saveButton = this.page.getByTestId('submitButton');
    this.successSnackbar = this.page.getByTestId(
      'snackbar-save-admin-apps-settings-success'
    );
    this.createFirstAuthClientButton = this.page.getByTestId('no-results');
    this.createAuthClientButton = this.page.getByTestId(
      'create-auth-client-button'
    );
    this.submitAuthClientFormButton = this.page.getByTestId(
      'submit-auth-client-form'
    );
    this.authClientEntry = this.page.getByTestId('auth-client');
  }

  async openAuthClientsTab() {
    this.authClientsTab.click();
  }

  async openFirstAuthClientCreateForm() {
    this.createFirstAuthClientButton.click();
  }

  async openAuthClientCreateForm() {
    this.createAuthClientButton.click();
  }

  async submitAuthClientForm() {
    this.submitAuthClientFormButton.click();
  }

  async authClientShouldBeVisible(authClientName) {
    await expect(
      this.authClientEntry.filter({ hasText: authClientName })
    ).toBeVisible();
  }
}
