const { AuthenticatedPage } = require('./authenticated-page');
const { expect } = require('@playwright/test');

export class ExecutionDetailsPage extends AuthenticatedPage {
  constructor(page) {
    super(page);

    this.executionCreatedAt = page.getByTestId('execution-created-at');
    this.executionId = page.getByTestId('execution-id');
    this.executionName = page.getByTestId('execution-name');
    this.executionStep = page.getByTestId('execution-step');
  }

  async verifyExecutionData(flowId) {
    await expect(this.executionCreatedAt).toContainText(/\d+ seconds? ago/);
    const executionIdFromUrl = this.page.url().split('/').pop();
    await expect(this.executionId).toHaveText(
      `Execution ID: ${executionIdFromUrl}`
    );
    await expect(this.executionName).toHaveText(flowId);
  }
}
