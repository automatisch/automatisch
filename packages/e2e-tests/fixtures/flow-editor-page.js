const { AuthenticatedPage } = require('./authenticated-page');
const { expect } = require('@playwright/test');
const axios = require('axios');

export class FlowEditorPage extends AuthenticatedPage {
  screenshotPath = '/flow-editor';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.appAutocomplete = this.page.getByTestId('choose-app-autocomplete');
    this.appAutocompleteInput = this.appAutocomplete.locator('input');
    this.eventAutocomplete = this.page.getByTestId('choose-event-autocomplete');
    this.eventAutocompleteInput = this.eventAutocomplete.locator('input');
    this.continueButton = this.page.getByTestId('flow-substep-continue-button');
    this.testAndContinueButton = this.page.getByText('Test & Continue');
    this.connectionAutocomplete = this.page.getByTestId(
      'choose-connection-autocomplete'
    );
    this.connectionAutocompleteInput =
      this.connectionAutocomplete.locator('input');
    this.addNewConnectionItem = this.page.getByText('Add new connection');
    this.testOutput = this.page.getByTestId('flow-test-substep-output');
    this.hasNoOutput = this.page.getByTestId('flow-test-substep-no-output');
    this.unpublishFlowButton = this.page.getByTestId('unpublish-flow-button');
    this.publishFlowButton = this.page.getByTestId('publish-flow-button');
    this.infoSnackbar = this.page.getByTestId('flow-cannot-edit-info-snackbar');
    this.trigger = this.page.getByLabel('Trigger on weekends?');
    this.stepCircularLoader = this.page.getByTestId('step-circular-loader');
    this.flowName = this.page.getByTestId('editableTypography');
    this.flowNameInput = this.page
      .getByTestId('editableTypographyInput')
      .locator('input');

    this.flowStep = this.page.getByTestId('flow-step');
    this.goBackButton = this.page.getByTestId('editor-go-back-button');
    this.exportFlowButton = page.getByTestId('export-flow-button');
    this.stepName = page.getByTestId('step-name');
    this.folderName = page.getByTestId('folder-name');
  }

  async createWebhookTrigger(workSynchronously) {
    await this.appAutocomplete.click();
    await this.page.getByRole('option', { name: 'Webhook' }).click();

    await expect(this.eventAutocomplete).toBeVisible();
    await this.eventAutocomplete.click();
    await this.page.getByRole('option', { name: 'Catch raw webhook' }).click();
    await this.continueButton.click();
    await this.page
      .getByTestId('parameters.workSynchronously-autocomplete')
      .click();
    await this.page
      .getByRole('option', { name: workSynchronously ? 'Yes' : 'No' })
      .click();
    await this.continueButton.click();

    const webhookUrl = this.page.locator('input[name="webhookUrl"]');
    if (workSynchronously) {
      await expect(webhookUrl).toHaveValue(/sync/);
    } else {
      await expect(webhookUrl).not.toHaveValue(/sync/);
    }

    const triggerResponse = await axios.get(await webhookUrl.inputValue());
    await expect(triggerResponse.status).toBe(204);

    await expect(this.testOutput).not.toBeVisible();
    await this.testAndContinueButton.click();
    await expect(this.testOutput).toBeVisible();
    await expect(this.hasNoOutput).not.toBeVisible();
    await this.continueButton.click();

    return await webhookUrl.inputValue();
  }

  async chooseAppAndEvent(appName, eventName) {
    await expect(this.appAutocomplete).toHaveCount(1);
    await this.appAutocomplete.click();
    await this.page.getByRole('option', { name: appName }).click();
    await expect(this.eventAutocomplete).toBeVisible();
    await this.eventAutocomplete.click();
    await Promise.all([
      this.page.waitForResponse(
        (resp) =>
          /(apps\/.*\/actions\/.*\/substeps)/.test(resp.url()) &&
          resp.status() === 200
      ),
      this.page.getByRole('option', { name: eventName }).click(),
    ]);
    await this.continueButton.click();
  }

  async testAndContinue() {
    await expect(this.continueButton).toHaveCount(1);
    await this.continueButton.click();
    await expect(this.testOutput).toBeVisible();
    await this.continueButton.click();
  }
}
