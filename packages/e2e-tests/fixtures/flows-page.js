const { AuthenticatedPage } = require('./authenticated-page');
const { TemplatesModal } = require('../fixtures/templates/templates-modal');

export class FlowsPage extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.searchInput = page.locator('#search-input');
    this.flowRow = page.getByTestId('flow-row');
    this.importFlowButton = page.getByTestId('import-flow-button');
    this.createFlowButton = page.getByTestId('create-flow-button');
    this.multiOptionButton = page.getByTestId('multi-option-button');
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
    this.useAsTemplate = page.getByRole('menuitem', {
      name: 'Use as template',
    });

    this.templatesModal = new TemplatesModal(page);
    this.createFromTemplateButton = page.getByRole('menuitem', {
      name: 'Create from template',
    });
    this.useAsTemplateMenuItem = page.getByRole('menuitem', {
      name: 'Use as template',
    });
  }

  async createTemplateFromFlow(flowId, templateName) {
    await this.flowRow.filter({ hasText: flowId }).getByRole('button').click();
    await this.useAsTemplateMenuItem.click();
    await this.templatesModal.templateNameInput.fill(templateName);
    await this.templatesModal.createButton.click();
  }
}
