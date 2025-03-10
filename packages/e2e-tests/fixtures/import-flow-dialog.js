const { AuthenticatedPage } = require('./authenticated-page');

export class ImportFlowDialog extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.fileName = page.getByTestId('file-name');
    this.fileNameWrapper = page.getByTestId('file-name-wrapper');
    this.importButton = page.getByTestId('import-flow-dialog-import-button');
    this.fileInput = page.locator("input[type='file']");
    this.genericImportError = page.getByTestId(
      'import-flow-dialog-generic-error-alert'
    );
    this.importParsingError = page.getByTestId(
      'import-flow-dialog-parsing-error-alert'
    );
    this.successAlert = page.getByTestId('import-flow-dialog-success-alert');
    this.successAlertLink = this.successAlert.getByRole('link');
  }
}
