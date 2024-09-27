const { AuthenticatedPage } = require('./authenticated-page');

export class MyProfilePage extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.fullName = this.page.locator('[name="fullName"]');
    this.email = this.page.locator('[name="email"]');
    this.currentPassword = this.page.locator('[name="currentPassword"]');
    this.newPassword = this.page.locator('[name="password"]');
    this.passwordConfirmation = this.page.locator('[name="confirmPassword"]');
    this.updateProfileButton = this.page.getByTestId('update-profile-button');
    this.updatePasswordButton = this.page.getByTestId('update-password-button');
    this.settingsMenuItem = this.page.getByRole('menuitem', {
      name: 'Settings',
    });
  }

  async navigateTo() {
    await this.profileMenuButton.click();
    await this.settingsMenuItem.click();
  }
}
