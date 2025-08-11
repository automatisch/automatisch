const { AuthenticatedPage } = require('./authenticated-page');

export class StepDetailsSidebar extends AuthenticatedPage {
  constructor(page) {
    super(page);
    

    this.stepDetailsSidebar = page.getByTestId('step-details-sidebar');
    this.stepName = this.stepDetailsSidebar.getByTestId('step-name');
  }
}
