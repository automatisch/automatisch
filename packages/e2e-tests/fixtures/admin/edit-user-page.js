const { faker } = require('@faker-js/faker');
const { AuthenticatedPage } = require('../authenticated-page');

faker.seed(9002);

export class AdminEditUserPage extends AuthenticatedPage {
  screenshot = '/admin/edit-user';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor (page) {
    super(page);
    this.fullNameInput = page.getByTestId('full-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.roleInput = page.getByTestId('role.id-autocomplete');
    this.updateButton = page.getByTestId('update-button');
    this.pageTitle = page.getByTestId('edit-user-title');
  }

  generateUser () {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
    }
  }
}