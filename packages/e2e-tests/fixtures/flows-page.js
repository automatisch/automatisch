const { AuthenticatedPage } = require('./authenticated-page');
const { expect } = require('@playwright/test');

export class FlowsPage extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.flowRow = this.page.getByTestId('flow-row');
    this.flowCard = this.page.getByTestId('card-action-area');
    this.deleteFlowMenuItem = this.page.getByRole('menuitem', {
      name: 'Delete',
    });
  }

  async clickOnDeleteFlowMenuItem() {
    await this.deleteFlowMenuItem.click();
  }

  async deleteFlow(flowId) {
    const desiredFlow = await this.flowRow.filter({
      has: this.page.locator(`a[href="/editor/${flowId}"]`),
    });
    await desiredFlow.locator('button').click();
    await this.clickOnDeleteFlowMenuItem();

    await expect(
      await this.flowRow.filter({
        has: this.page.locator(`a[href="/editor/${flowId}"]`),
      })
    ).toHaveCount(0);

    const snackbar = await this.getSnackbarData();
    await expect(snackbar.variant).toBe('success');
  }
}
