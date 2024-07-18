import { BasePage } from "./base-page";
const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');

export class AdminSetupPage extends BasePage {
  path = '/installation';

  /**
  * @param {import('@playwright/test').Page} page
  */
  constructor(page) {
    super(page);

    this.fullNameTextField = this.page.getByTestId('fullName-text-field');
    this.emailTextField = this.page.getByTestId('email-text-field');
    this.passwordTextField = this.page.getByTestId('password-text-field');
    this.repeatPasswordTextField = this.page.getByTestId('repeat-password-text-field');
    this.createAdminButton = this.page.getByTestId('signUp-button');
    this.invalidFields = this.page.locator('p.Mui-error');
    this.successAlert = this.page.getByTestId('success-alert');
  }

  async open() {
    return await this.page.goto(this.path);
  }

  async fillValidUserData() {
    await this.fullNameTextField.fill(process.env.LOGIN_EMAIL);
    await this.emailTextField.fill(process.env.LOGIN_EMAIL);
    await this.passwordTextField.fill(process.env.LOGIN_PASSWORD);
    await this.repeatPasswordTextField.fill(process.env.LOGIN_PASSWORD);
  }

  async fillInvalidUserData() {
    await this.fullNameTextField.fill('');
    await this.emailTextField.fill('abcde');
    await this.passwordTextField.fill('');
    await this.repeatPasswordTextField.fill('a');
  }

  async fillNotMatchingPasswordUserData() {
    const testUser = this.generateUser();
    await this.fullNameTextField.fill(testUser.fullName);
    await this.emailTextField.fill(testUser.email);
    await this.passwordTextField.fill(testUser.password);
    await this.repeatPasswordTextField.fill(testUser.wronglyRepeatedPassword);
  }

  async submitAdminForm()  {
    await this.createAdminButton.click();
  }

  async expectInvalidFields(errorCount) {
    await expect(await this.invalidFields.all()).toHaveLength(errorCount);
  }

  async expectSuccessAlertToBeVisible() {
    await expect(await this.successAlert).toBeVisible();
  }

  async expectSuccessMessageToContainLoginLink() {
    await expect(await this.successAlert.locator('a')).toHaveAttribute('href', '/login');
  }

  generateUser() {
    faker.seed(Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER));

    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      wronglyRepeatedPassword: faker.internet.password()
    };
  }
};
