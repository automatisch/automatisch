const path = require('node:path');
const { AuthenticatedPage } = require('./authenticated-page');

export class UserInterfacePage extends AuthenticatedPage {
  screenshotPath = '/user-interface';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

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
