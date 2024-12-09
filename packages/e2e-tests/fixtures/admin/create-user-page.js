const { expect } = require('@playwright/test');

const { faker } = require('@faker-js/faker');
const { AuthenticatedPage } = require('../authenticated-page');

export class AdminCreateUserPage extends AuthenticatedPage {
  screenshot = '/admin/create-user';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.fullNameInput = page.getByTestId('full-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.roleInput = page.getByTestId('roleId-autocomplete');
    this.createButton = page.getByTestId('create-button');
    this.pageTitle = page.getByTestId('create-user-title');
    this.invitationEmailInfoAlert = page.getByTestId(
      'invitation-email-info-alert'
    );
    this.acceptInvitationLink = page
      .getByTestId('invitation-email-info-alert')
      .getByRole('link');
    this.createUserSuccessAlert = page.getByTestId('create-user-success-alert');
    this.fieldError = page.locator('p[id$="-helper-text"]');
  }

  seed(seed) {
    faker.seed(seed || 0);
  }

  generateUser() {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
    };
  }

  async expectCreateUserSuccessAlertToBeVisible() {
    await expect(this.createUserSuccessAlert).toBeVisible();
  }
}
