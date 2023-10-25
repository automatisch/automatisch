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
    this.updateButton = page.getByTestId('update-button');
  }

  generateUser () {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
    }
  }
}