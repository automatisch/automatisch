const { AuthenticatedPage } = require('./authenticated-page');

export class FlowsPage extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.flowRow = this.page.getByTestId('flow-row');
    this.importFlowButton = page.getByTestId('import-flow-button');
  }
}
