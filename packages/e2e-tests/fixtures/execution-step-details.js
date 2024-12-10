const { ExecutionDetailsPage } = require('./execution-details-page');
const { expect } = require('@playwright/test');

export class ExecutionStepDetails extends ExecutionDetailsPage {
  constructor(page, executionStep) {
    super(page);

    this.executionStep = executionStep;
    this.stepType = executionStep.getByTestId('step-type');
    this.stepPositionAndName = executionStep.getByTestId(
      'step-position-and-name'
    );
    this.executionStepId = executionStep.getByTestId('execution-step-id');
    this.executionStepExecutedAt = executionStep.getByTestId(
      'execution-step-executed-at'
    );
    this.dataInTab = executionStep.getByTestId('data-in-tab');
    this.dataInPanel = executionStep.getByTestId('data-in-panel');
    this.dataOutTab = executionStep.getByTestId('data-out-tab');
    this.dataOutPanel = executionStep.getByTestId('data-out-panel');
  }

  async expectDataInTabToBeSelectedByDefault() {
    await expect(this.dataInTab).toHaveClass(/Mui-selected/);
  }

  async expectDataInToContainText(searchText, desiredText) {
    await expect(this.dataInPanel).toContainText(desiredText);
    await this.dataInPanel.locator('#search-input').fill(searchText);
    await expect(this.dataInPanel).toContainText(desiredText);
  }

  async expectDataOutToContainText(searchText, desiredText) {
    await expect(this.dataOutPanel).toContainText(desiredText);
    await this.dataOutPanel.locator('#search-input').fill(searchText);
    await expect(this.dataOutPanel).toContainText(desiredText);
  }

  async verifyTriggerExecutionStep({
    stepPositionAndName,
    stepDataInKey,
    stepDataInValue,
    stepDataOutKey,
    stepDataOutValue,
  }) {
    await expect(this.stepType).toHaveText('Trigger');
    await this.verifyExecutionStep({
      stepPositionAndName,
      stepDataInKey,
      stepDataInValue,
      stepDataOutKey,
      stepDataOutValue,
    });
  }

  async verifyActionExecutionStep({
    stepPositionAndName,
    stepDataInKey,
    stepDataInValue,
    stepDataOutKey,
    stepDataOutValue,
  }) {
    await expect(this.stepType).toHaveText('Action');
    await this.verifyExecutionStep({
      stepPositionAndName,
      stepDataInKey,
      stepDataInValue,
      stepDataOutKey,
      stepDataOutValue,
    });
  }

  async verifyExecutionStep({
    stepPositionAndName,
    stepDataInKey,
    stepDataInValue,
    stepDataOutKey,
    stepDataOutValue,
  }) {
    await expect(this.stepPositionAndName).toHaveText(stepPositionAndName);
    await expect(this.executionStepId).toHaveText(
      /ID: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    await expect(this.executionStepExecutedAt).toContainText(
      /executed \d+ seconds? ago/
    );
    await this.expectDataInTabToBeSelectedByDefault();
    await this.expectDataInToContainText(stepDataInKey, stepDataInValue);
    await this.dataOutTab.click();
    await expect(this.dataOutPanel).toContainText(stepDataOutValue);
    await this.expectDataOutToContainText(stepDataOutKey, stepDataOutValue);
  }
}
