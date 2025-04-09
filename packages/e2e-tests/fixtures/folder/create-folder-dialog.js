const { AuthenticatedPage } = require('../authenticated-page');

export class CreateFolderDialog extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.folderNameInput = page.getByTestId('new-folder-name').locator('input');
    this.createButton = page.getByTestId('create-folder-dialog-create-button');
    this.successAlert = page.getByTestId('create-folder-dialog-success-alert');
    this.errorAlert = page.getByTestId(
      'create-folder-dialog-generic-error-alert'
    );
    this.closeDialog = page.getByTestId('close-dialog');
  }
}
