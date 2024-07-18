const { faker } = require('@faker-js/faker');
const { AuthenticatedPage } = require('../authenticated-page');

faker.seed(9002);

export class AdminEditUserPage extends AuthenticatedPage {
  screenshot = '/admin/edit-user';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.fullNameInput = page.getByTestId('full-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.roleInput = page.getByTestId('role.id-autocomplete');
    this.updateButton = page.getByTestId('update-button');
    this.pageTitle = page.getByTestId('edit-user-title');
  }

  /**
   * @param {string} fullName
   */
  async waitForLoad(fullName) {
    return await this.page.waitForFunction((fullName) => {
      // eslint-disable-next-line no-undef
      const el = document.querySelector("[data-test='full-name-input']");
      return el && el.value === fullName;
    }, fullName);
  }

  generateUser() {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
    };
  }
}
