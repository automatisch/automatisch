const { GithubPage } = require('./apps/github/github-page');
const { BasePage } = require('./base-page');

export class ApplicationsModal extends BasePage {

  applications = {
    github: GithubPage
  };

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor (page) {
    super(page);
    this.modal = page.getByTestId('add-app-connection-dialog');
    this.searchInput = this.modal.getByTestId('search-for-app-text-field');
    this.appListItem = this.modal.getByTestId('app-list-item');
    this.appLoader = this.modal.getByTestId('search-for-app-loader');
  }

  /**
   * @param string link
   */
  async selectLink (link) {
    if (this.applications[link] === undefined) {
      throw {
        message: `Unknown link "${link}" passed to ApplicationsModal.selectLink`
      }
    }
    await this.searchInput.fill(link);
    await this.appListItem.first().click();
    return new this.applications[link](this.page);
  }
}