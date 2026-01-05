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

    this.powerInput = page.getByTestId('power-input');
    this.searchInput = page.getByTestId('search-input').locator('input');
    this.powerInputSuggestionItem = page.getByTestId(
      'power-input-suggestion-item'
    );

    this.workSynchronouslyParamter = page.getByTestId(
      'parameters.workSynchronously-autocomplete'
    );
    this.headerPowerInputParameter = page.getByTestId(
      'parameters.headers.0.key-power-input'
    );
    this.bodyPowerInputParameter = page
      .getByTestId('parameters.body-power-input')
      .locator('[contenteditable="true"]');

    this.redirectUrlParameter = page.getByTestId(
      'parameters.asyncRedirectUrl-power-input'
    );
    this.formLink = page.getByTestId('form-preview-link');
  }

  async createWebhookTrigger(workSynchronously) {
    await this.flowStep.first().click();

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

    await this.page.waitForLoadState();
    const webhookUrl = await this.page
      .locator('input[name="webhookUrl"]')
      .inputValue();
    if (workSynchronously) {
      expect(webhookUrl).toContain('sync');
    } else {
      expect(webhookUrl).not.toContain('sync');
    }

    const triggerResponse = await axios.get(webhookUrl);
    await expect(triggerResponse.status).toBe(204);

    await expect(this.testOutput).not.toBeVisible();
    await this.testAndContinueButton.click();
    await expect(this.testOutput).toBeVisible();
    await expect(this.hasNoOutput).not.toBeVisible();
    await this.continueButton.click();

    return webhookUrl;
  }

  async createFormTrigger(
    formName,
    workSynchronously = 'Yes',
    redirectUrl = ''
  ) {
    await expect(this.flowStep).toHaveCount(2);
    await this.flowStep.first().click();

    await this.appAutocomplete.click();
    await this.page.getByRole('option', { name: 'Forms', exact: true }).click();

    await expect(this.eventAutocomplete).toBeVisible();
    await this.eventAutocomplete.click();
    await this.page
      .getByRole('option', { name: 'New form submission' })
      .click();
    await this.continueButton.click();
    await expect(this.appAutocomplete).not.toBeVisible();
    await expect(this.eventAutocomplete).not.toBeVisible();

    await this.powerInput.click();
    await this.searchInput.fill(formName);
    await this.powerInputSuggestionItem.filter({ hasText: formName }).click();
    await this.workSynchronouslyParamter.click();
    await this.page.getByRole('option', { name: workSynchronously }).click();
    if (redirectUrl) {
      await this.redirectUrlParameter.fill(redirectUrl);
    }
    await expect(this.continueButton).not.toBeDisabled();
    const formUrl = await this.formLink.getAttribute('href');
    await this.continueButton.click();
    await this.testAndContinueButton.click();
    await expect(this.hasNoOutput).toBeVisible();

    return formUrl;
  }

  async chooseAppAndEvent(appName, eventName) {
    await expect(this.appAutocomplete).toHaveCount(1);
    await this.appAutocomplete.click();
    await this.page.getByRole('option', { name: appName, exact: true }).click();
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

  async expectWebhookWorkSynchronouslyParameterToHaveValue(value) {
    await expect(
      this.page
        .getByTestId('parameters.workSynchronously-autocomplete')
        .first()
        .getByRole('combobox')
    ).toHaveValue(value);
  }

  async expectQueryStatementToHaveText(desiredText) {
    await expect(
      this.page
        .getByTestId('parameters.queryStatement-power-input')
        .getByRole('textbox')
    ).toHaveText(desiredText);
  }

  async createBasicAction(appName, eventName, responseBodyContent) {
    await expect(this.flowStep).toHaveCount(2);

    await this.flowStep.nth(1).click();
    await this.chooseAppAndEvent(appName, eventName);
    await this.bodyPowerInputParameter.fill(responseBodyContent);
    await this.clickAway();
    await expect(this.headerPowerInputParameter).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
    await this.testAndContinue();
  }
}
