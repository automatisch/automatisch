export class DeleteRoleModal {
  screenshotPath = '/admin/delete-role-modal';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor (page) {
    this.page = page;
    this.modal = page.getByTestId('delete-role-modal');
    this.cancelButton = this.modal.getByTestId('confirmation-cancel-button');
    this.deleteButton = this.modal.getByTestId('confirmation-confirm-button');
  }

  async close () {
    await this.page.click('body', {
      position: { x: 10, y: 10 }
    });
  }
}