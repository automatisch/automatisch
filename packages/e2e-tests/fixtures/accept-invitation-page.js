const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');

export class AcceptInvitation extends BasePage {
  path = '/accept-invitation';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.page = page;
    this.passwordTextField = this.page.getByTestId('password-text-field');
    this.passwordConfirmationTextField = this.page.getByTestId('confirm-password-text-field');
    this.submitButton = this.page.getByTestId('submit-button');
    this.pageTitle = this.page.getByTestId('accept-invitation-form-title');
    this.formErrorMessage = this.page.getByTestId('accept-invitation-form-error');
  }

  async open(token) {
    return await this.page.goto(`${this.path}?token=${token}`);
  }

  async acceptInvitation(
    password
  ) {
    await this.passwordTextField.fill(password);
    await this.passwordConfirmationTextField.fill(password);

    await this.submitButton.click();
  }

  async fillPasswordField(password) {
    await this.passwordTextField.fill(password);
    await this.passwordConfirmationTextField.fill(password);
  }

  async excpectSubmitButtonToBeDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectAlertToBeVisible() {
    await expect(this.formErrorMessage).toBeVisible();
  }
}
