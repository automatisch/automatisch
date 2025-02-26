const { AuthenticatedPage } = require('./authenticated-page');

export class ExecutionsPage extends AuthenticatedPage {
  screenshotPath = '/executions';

  constructor(page) {
    super(page);

    this.executionRow = this.page.getByTestId('execution-row');
    this.executionsPageLoader = this.page.getByTestId('executions-loader');
  }
}
