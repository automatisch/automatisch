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
    this.roleInput = page.getByTestId('role.id-autocomplete');
    this.createButton = page.getByTestId('create-button');
    this.pageTitle = page.getByTestId('create-user-title');
    this.invitationEmailInfoAlert = page.getByTestId('invitation-email-info-alert');
    this.acceptInvitationLink = page.getByTestId('invitation-email-info-alert').getByRole('link');
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
}
