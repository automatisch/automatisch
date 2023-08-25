const path = require('node:path');
const { BasePage } = require('./base-page');

export class UserInterfacePage extends BasePage {
  constructor(page) {
    super(page);

    this.profileMenuButton = this.page.getByTestId('profile-menu-button');
    this.adminMenuItem = this.page.getByRole('menuitem', { name: 'Admin' });
    this.userInterfaceDrawerItem = this.page.getByRole('button', {
      name: 'User Interface',
    });
    this.appBar = this.page.getByTestId('app-bar');
    this.goToDashboardButton = this.page.getByRole('button', {
      name: 'Go to the dashboard',
    });
    this.logoSrc = this.page.getByTestId('logo').locator('img');
    this.flowRowCardActionArea = this.page
      .getByTestId('flow-row')
      .first()
      .getByTestId('card-action-area');
    this.updateButton = this.page.getByTestId('update-button');
    this.primaryMainColorInput = this.page
      .getByTestId('primary-main-color-input')
      .getByTestId('color-text-field');
    this.primaryDarkColorInput = this.page
      .getByTestId('primary-dark-color-input')
      .getByTestId('color-text-field');
    this.primaryLightColorInput = this.page
      .getByTestId('primary-light-color-input')
      .getByTestId('color-text-field');
    this.logoSvgCodeInput = this.page.getByTestId('logo-svg-data-text-field');
    this.primaryMainColorButton = this.page
      .getByTestId('primary-main-color-input')
      .getByTestId('color-button');
    this.primaryDarkColorButton = this.page
      .getByTestId('primary-dark-color-input')
      .getByTestId('color-button');
    this.primaryLightColorButton = this.page
      .getByTestId('primary-light-color-input')
      .getByTestId('color-button');
  }

  async screenshot(options = {}) {
    const { path: plainPath, ...restOptions } = options;

    const computedPath = path.join('user-interface', plainPath);

    return await super.screenshot({ path: computedPath, ...restOptions });
  }

  hexToRgb(hexColor) {
    hexColor = hexColor.replace('#', '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

  encodeSVG(svgCode) {
    const encoded = encodeURIComponent(svgCode);

    return `data:image/svg+xml;utf8,${encoded}`;
  }
}
