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
    await expect(this.executionId).toHaveText(
      /Execution ID: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    await expect(this.executionName).toHaveText(flowId);
  }
}
