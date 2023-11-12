const { BasePage } = require('./base-page');

export class LoginPage extends BasePage {
  path = '/login';
  static defaultEmail = process.env.LOGIN_EMAIL;
  static defaultPassword = process.env.LOGIN_PASSWORD;

  static setDefaultLogin(email, password) {
    this.defaultEmail = email;
    this.defaultPassword = password;
  }

  static resetDefaultLogin() {
    this.defaultEmail = process.env.LOGIN_EMAIL;
    this.defaultPassword = process.env.LOGIN_PASSWORD;
  }

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.page = page;
    this.emailTextField = this.page.getByTestId('email-text-field');
    this.passwordTextField = this.page.getByTestId('password-text-field');
    this.loginButton = this.page.getByTestId('login-button');
    this.pageTitle = this.page.getByTestId('login-form-title');
  }

  async open() {
    return await this.page.goto(this.path);
  }

  async login(
    email = LoginPage.defaultEmail,
    password = LoginPage.defaultPassword
  ) {
    await this.page.goto(this.path);
    await this.emailTextField.fill(email);
    await this.passwordTextField.fill(password);

    await this.loginButton.click();
  }
}
