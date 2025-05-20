const { AuthenticatedPage } = require('../authenticated-page');

export class MoveFolderDialog extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.folderNameAutocomplete = page
      .getByTestId('move-to-folder-name')
      .locator('input');
    this.moveButton = page.getByTestId(
      'flow-folder-change-dialog-confirm-button'
    );
    this.successAlert = page.getByTestId(
      'flow-folder-change-dialog-success-alert'
    );
    this.closeDialog = page.getByTestId('close-dialog');
  }
}
