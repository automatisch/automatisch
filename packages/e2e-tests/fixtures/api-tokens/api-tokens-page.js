import { AuthenticatedPage } from '../authenticated-page';

export class ApiTokensPage extends AuthenticatedPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.createTokenButton = page.getByTestId('create-token-button');
    this.noResults = page.getByTestId('no-results');
    this.apiTokensDrawerLink = page.getByTestId('api-tokens-drawer-link');
    this.apiTokenValue = page.getByTestId('api-token-field');
    this.copyTokenButton = page.getByTestId('copy-token-button');
    this.closeButton = page.getByTestId('close-button');
    this.deleteButton = page.getByTestId('delete-button');
    this.confirmDeleteButton = page.getByTestId('confirmation-confirm-button');
    this.apiTokenRow = page.getByTestId('api-token-row');
  }

  async navigateTo() {
    await this.page.goto('/admin-settings/api-tokens');
  }
}
