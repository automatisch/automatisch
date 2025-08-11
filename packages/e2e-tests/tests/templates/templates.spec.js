const { test, expect } = require('../../fixtures/index');
const { addTemplate } = require('../../helpers/template-api-helper');
import { TemplatesPage } from '../../fixtures/templates/templates-page';
import { LoginPage } from '../../fixtures/login-page';
import { FlowsPage } from '../../fixtures/flows-page';

import Crypto from 'crypto';

test.describe.serial('Templates', () => {
  let context;
  test.afterEach(async () => {
    if (context) {
      await context.close();
    }
  });

  test('template lifecycle - disabled', async ({
    flowsPage,
    templatesPage,
    page,
    request,
  }) => {
    const templateName = Crypto.randomUUID();
    const { flowId } = await templatesPage.prepareFlowViaAPI(request);

    await templatesPage.navigateTo();
    await templatesPage.switch.uncheck();
    await expect(templatesPage.switch).not.toBeChecked();
    await page.goto('/');

    await test.step('create template', async () => {
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowId,
        })
      ).toHaveCount(1);

      await flowsPage.createTemplateFromFlow(flowId, templateName);
      await expect(templatesPage.templateRow(templateName)).toHaveCount(1);
    });

    // no visual feedback on update
    await test.step('should be able to edit a template name', async () => {
      await templatesPage.templateRow(templateName).click();
      await templatesPage.templateNameInput.fill(`${templateName}-edited`);
      const requestPromise = page.waitForRequest(
        (request) => request.method() === 'PATCH'
      );
      await templatesPage.updateButton.click();
      await requestPromise;
      await page.goBack();
    });

    await test.step('create flow from template should not be possible', async () => {
      await page.goto('/flows');
      await expect(flowsPage.multiOptionButton).not.toBeVisible();
    });

    await test.step('delete template on the Templates page', async () => {
      await templatesPage.navigateTo();
      await templatesPage.templateButton(`${templateName}-edited`).click();
      await templatesPage.deleteMenuItem.click();
      await expect(
        templatesPage.templateRow(`${templateName}-edited`)
      ).toHaveCount(0);
      const deleteTemplateSnackbar = await templatesPage.getSnackbarData(
        'snackbar'
      );
      await expect(deleteTemplateSnackbar.variant).toBe('success');
    });
  });

  test('template lifecycle - enabled', async ({
    flowsPage,
    flowEditorPage,
    templatesPage,
    page,
    request,
    stepDetailsSidebar,
  }) => {
    const templateName = Crypto.randomUUID();
    const { token, flowId } = await templatesPage.prepareFlowViaAPI(request);
    await templatesPage.setupComplexFlow(request, token, flowId);
    await templatesPage.navigateTo();
    await templatesPage.switch.check();
    await expect(templatesPage.switch).toBeChecked();

    await page.goto('/');
    await test.step('create template', async () => {
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowId,
        })
      ).toHaveCount(1);

      await flowsPage.createTemplateFromFlow(flowId, templateName);
      await expect(templatesPage.templateRow(templateName)).toHaveCount(1);
    });

    // no visual feedback on update
    await test.step('should be able to edit a template name', async () => {
      await templatesPage.templateRow(templateName).click();
      await templatesPage.templateNameInput.fill(`${templateName}-edited`);
      const requestPromise = page.waitForRequest(
        (request) => request.method() === 'PATCH'
      );
      await templatesPage.updateButton.click();
      await requestPromise;
    });

    await test.step('create flow from template', async () => {
      await page.goto('/');
      await flowsPage.multiOptionButton.click();
      await flowsPage.createFromTemplateButton.click();
      await flowsPage.templatesModal.modal.waitFor({ state: 'visible' });
      await flowsPage.templatesModal
        .templateRow(`${templateName}-edited`)
        .click();
      await expect(page).toHaveURL(
        /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
      );
    });

    await test.step('verify imported flow', async () => {
      await expect(flowEditorPage.flowStep).toHaveCount(2);
      await flowEditorPage.stepName.first().click();
      await expect(stepDetailsSidebar.stepName).toHaveText('1. triggerStep');
      await expect(flowEditorPage.stepName.first()).toHaveText(
        '1. triggerStep'
      );
      await flowEditorPage.continueButton.click();
      await flowEditorPage.expectWebhookWorkSynchronouslyParameterToHaveValue(
        'Yes'
      );

      await flowEditorPage.continueButton.last().click();

      const webhookUrl = await page.locator('input[name="webhookUrl"]');
      await request.get(`${await webhookUrl.inputValue()}`);

      await flowEditorPage.testAndContinueButton.click();
      await expect(flowEditorPage.testOutput).toBeVisible();
      await flowEditorPage.continueButton.click();

      await expect(flowEditorPage.stepName.nth(1)).toHaveText('2. SQLQuery!');
      await expect(flowEditorPage.appAutocompleteInput).toHaveCount(1);
      await expect(flowEditorPage.appAutocompleteInput).toHaveValue(
        'PostgreSQL'
      );
      await expect(flowEditorPage.eventAutocompleteInput).toHaveValue(
        'SQL query'
      );
      await flowEditorPage.continueButton.last().click();
      await expect(flowEditorPage.connectionAutocompleteInput).toHaveValue('');
      await page.getByText('Set up action').click();
      await flowEditorPage.expectQueryStatementToHaveText(
        'select * from users where test= step1.headers.host: localhost:3000;'
      );
    });

    await test.step('delete template on the Templates page', async () => {
      await templatesPage.navigateTo();
      await templatesPage.templateButton(`${templateName}-edited`).click();
      await templatesPage.deleteMenuItem.click();
      await expect(
        templatesPage.templateRow(`${templateName}-edited`)
      ).toHaveCount(0);
      const deleteTemplateSnackbar = await templatesPage.getSnackbarData(
        'snackbar'
      );
      await expect(deleteTemplateSnackbar.variant).toBe('success');
    });

    await test.step('flow should still exist', async () => {
      await page.goto('/flows');
      await expect(flowsPage.flowRow.filter({ hasText: flowId })).toHaveCount(
        2
      );
    });

    await test.step('should not create flow from removed template', async () => {
      await page.goto('/flows');
      await flowsPage.multiOptionButton.click();
      await flowsPage.createFromTemplateButton.click();
      await flowsPage.templatesModal.modal.waitFor({ state: 'visible' });
      await expect(
        flowsPage.templatesModal.templateRow(`${templateName}-edited`)
      ).toHaveCount(0);
    });
  });

  test.skip('search for templates', async ({ templatesPage, request }) => {
    const templateName = Crypto.randomUUID();
    const { token, flowId } = await templatesPage.prepareFlowViaAPI(request);
    await addTemplate(request, token, flowId, templateName);
    await templatesPage.navigateTo();
    await templatesPage.searchInput.fill(templateName);
    await expect(templatesPage.templateRowLocator).toHaveCount(1);
  });

  test.skip('filters should be kept when creating flow from template', async ({
    flowsPage,
    page,
  }) => {
    await page.goto('/flows?onlyOwnedFlows=true&status=published');
    await flowsPage.multiOptionButton.click();
    await expect(page).toHaveURL(
      '/flows/templates?onlyOwnedFlows=true&status=published'
    );
  });

  test('delete template on the template page should throw snackbar for already deleted template on the modal', async ({
    browser,
    request,
  }) => {
    const templateName = Crypto.randomUUID();

    context = await browser.newContext();

    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();

    const loginPageOne = new LoginPage(pageOne);
    await loginPageOne.login();
    const templatesPage = new TemplatesPage(pageTwo);
    const flowsPage = new FlowsPage(pageOne);
    const templatesModal = flowsPage.templatesModal;
    const { token, flowId } = await templatesPage.prepareFlowViaAPI(request);
    await addTemplate(request, token, flowId, templateName);

    await templatesPage.navigateTo();
    await templatesPage.switch.check();
    await expect(templatesPage.switch).toBeChecked();

    await flowsPage.multiOptionButton.click();
    await flowsPage.createFromTemplateButton.click();
    await templatesModal.templateButton(`${templateName}`).click();
    const requestPromise = pageOne.waitForRequest(
      (request) => request.method() === 'DELETE'
    );
    await templatesModal.deleteMenuItem.click();
    await requestPromise;
    await expect(templatesModal.templateRow(`${templateName}`)).toHaveCount(0);
    await templatesPage.templateButton(`${templateName}`).click();
    await templatesPage.deleteMenuItem.click();
    const snackbar = await templatesPage.getSnackbarData('snackbar');
    await expect(snackbar.variant).toBe('error');
  });

  test('delete template on the modal should throw snackbar for already deleted template on the template page', async ({
    browser,
    request,
  }) => {
    const templateName = Crypto.randomUUID();

    context = await browser.newContext();

    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();

    const loginPageOne = new LoginPage(pageOne);
    await loginPageOne.login();
    const templatesPage = new TemplatesPage(pageTwo);
    const flowsPage = new FlowsPage(pageOne);
    const templatesModal = flowsPage.templatesModal;
    const { token, flowId } = await templatesPage.prepareFlowViaAPI(request);
    await addTemplate(request, token, flowId, templateName);

    await templatesPage.navigateTo();
    await templatesPage.switch.check();
    await expect(templatesPage.switch).toBeChecked();

    await flowsPage.multiOptionButton.click();
    await flowsPage.createFromTemplateButton.click();
    await templatesModal.templateButton(`${templateName}`).click();
    await templatesPage.templateButton(`${templateName}`).click();
    const requestPromise = pageTwo.waitForRequest(
      (request) => request.method() === 'DELETE'
    );
    await templatesPage.deleteMenuItem.click();
    await requestPromise;
    await expect(templatesPage.templateRow(templateName)).toHaveCount(0);
    await templatesModal.deleteMenuItem.click();

    const snackbar = await flowsPage.getSnackbarData('snackbar');
    await expect(snackbar.variant).toBe('error');
  });

  test('edit deleted template on the template page', async ({
    browser,
    request,
  }) => {
    const templateName = Crypto.randomUUID();

    context = await browser.newContext();

    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();

    const loginPageOne = new LoginPage(pageOne);
    await loginPageOne.login();
    const templatesPage = new TemplatesPage(pageTwo);
    const flowsPage = new FlowsPage(pageOne);
    const templatesModal = flowsPage.templatesModal;

    const { token, flowId } = await templatesPage.prepareFlowViaAPI(request);
    await addTemplate(request, token, flowId, templateName);

    await templatesPage.navigateTo();
    await templatesPage.switch.check();
    await expect(templatesPage.switch).toBeChecked();

    await flowsPage.multiOptionButton.click();
    await flowsPage.createFromTemplateButton.click();
    await templatesModal.templateButton(`${templateName}`).click();
    const requestPromise = pageOne.waitForRequest(
      (request) => request.method() === 'DELETE'
    );
    await templatesModal.deleteMenuItem.click();
    await requestPromise;
    await templatesPage.templateRow(templateName).click();
    await expect(templatesPage.updateAlert).toBeVisible();
  });
});
