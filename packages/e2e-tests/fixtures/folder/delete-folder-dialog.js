const { AuthenticatedPage } = require('../authenticated-page');

export class DeleteFolderDialog extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.modal = page.getByTestId('delete-folder-modal');
    this.cancelButton = this.modal.getByTestId('confirmation-cancel-button');
    this.deleteButton = this.modal.getByTestId('confirmation-confirm-button');
    this.deleteAlert = this.modal.getByTestId(
      'confirmation-dialog-error-alert'
    );
  }
}
