const { AuthenticatedPage } = require('./authenticated-page');

export class FlowsPage extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.searchInput = page.locator('#search-input');
    this.flowRow = page.getByTestId('flow-row');
    this.importFlowButton = page.getByTestId('import-flow-button');
    this.createFlowButton = page.getByTestId('create-flow-button');
    this.uncategorizedFlowsFolder = page.getByTestId(
      'uncategorized-flows-folder'
    );
    this.allFlowsFolder = page.getByTestId('all-flows-folder');
    this.addNewFolderButton = page.getByTestId('add-folder-button');
    this.userFolders = page.getByTestId('user-folders');
    this.editFolder = page.getByTestId('edit-folder');
    this.deleteFolder = page.getByTestId('delete-folder');
    this.deleteFolderSuccessAlert = page.getByTestId(
      'snackbar-delete-folder-success'
    );

    //flow actions
    this.moveTo = page.getByTestId('move-to');
    this.delete = page.getByTestId('delete-flow');
  }
}
