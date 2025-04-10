const { AuthenticatedPage } = require('../authenticated-page');

export class UpdateFolderDialog extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.folderNameInput = page.getByTestId('new-folder-name').locator('input');
    this.updateButton = page.getByTestId('edit-folder-dialog-update-button');
    this.successAlert = page.getByTestId('edit-folder-dialog-success-alert');
    this.closeDialog = page.getByTestId('close-dialog');
  }
}
