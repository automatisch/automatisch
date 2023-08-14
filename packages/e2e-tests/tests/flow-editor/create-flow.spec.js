// @ts-check
const { test, expect } = require('../../fixtures/index');

test('Flow editor page', async ({ flowEditorPage }) => {
  await flowEditorPage.login();

  // create flow
  await flowEditorPage.page.getByTestId('create-flow-button').click();

  await expect(flowEditorPage.page).toHaveURL(/\/editor\/create/);
  await expect(flowEditorPage.page).toHaveURL(
    /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
  );

  // has two steps by default
  await expect(flowEditorPage.page.getByTestId('flow-step')).toHaveCount(2);

  // arrange Scheduler trigger
  await flowEditorPage.appAutocomplete.click();
  await flowEditorPage.page.getByRole('option', { name: 'Scheduler' }).click();

  await expect(flowEditorPage.eventAutocomplete).toBeVisible();
  await flowEditorPage.eventAutocomplete.click();
  await flowEditorPage.page.getByRole('option', { name: 'Every hour' }).click();

  // continue to next step
  await flowEditorPage.continueButton.click();

  await expect(flowEditorPage.appAutocomplete).not.toBeVisible();
  await expect(flowEditorPage.eventAutocomplete).not.toBeVisible();

  // set up a trigger
  await expect(flowEditorPage.trigger).toBeVisible();
  await flowEditorPage.trigger.click();
  await flowEditorPage.page.getByRole('option', { name: 'Yes' }).click();

  await flowEditorPage.continueButton.click();

  await expect(flowEditorPage.trigger).not.toBeVisible();

  // show sample output
  await expect(flowEditorPage.testOuput).not.toBeVisible();
  await flowEditorPage.continueButton.click();
  await expect(flowEditorPage.testOuput).toBeVisible();
  await flowEditorPage.screenshot({
    path: 'Scheduler trigger test output.png',
  });
  await flowEditorPage.continueButton.click();

  // arrange Ntfy action
  await flowEditorPage.appAutocomplete.click();
  await flowEditorPage.page.getByRole('option', { name: 'Ntfy' }).click();

  await expect(flowEditorPage.eventAutocomplete).toBeVisible();
  await flowEditorPage.eventAutocomplete.click();
  await flowEditorPage.page
    .getByRole('option', { name: 'Send message' })
    .click();

  await flowEditorPage.continueButton.click();

  await expect(flowEditorPage.appAutocomplete).not.toBeVisible();
  await expect(flowEditorPage.eventAutocomplete).not.toBeVisible();

  // choose connection
  await flowEditorPage.connectionAutocomplete.click();
  await flowEditorPage.page.getByRole('listitem').first().click();

  await flowEditorPage.continueButton.click();

  await expect(flowEditorPage.connectionAutocomplete).not.toBeVisible();

  await flowEditorPage.page
    .getByTestId('parameters.topic-power-input')
    .locator('[contenteditable]')
    .fill('Topic');
  await flowEditorPage.page
    .getByTestId('parameters.message-power-input')
    .locator('[contenteditable]')
    .fill('Message body');

  // continue to next step
  await flowEditorPage.continueButton.click();
  await expect(flowEditorPage.connectionAutocomplete).not.toBeVisible();

  // show sample output
  await expect(flowEditorPage.testOuput).not.toBeVisible();
  await flowEditorPage.page
    .getByTestId('flow-substep-continue-button')
    .first()
    .click();
  await expect(flowEditorPage.testOuput).toBeVisible();
  await flowEditorPage.screenshot({
    path: 'Ntfy action test output.png',
  });
  await flowEditorPage.continueButton.click();

  // publish flow
  await expect(flowEditorPage.unpublishFlowButton).not.toBeVisible();
  await expect(flowEditorPage.publishFlowButton).toBeVisible();
  await flowEditorPage.publishFlowButton.click();
  await expect(flowEditorPage.publishFlowButton).not.toBeVisible();

  // shows read-only sticky snackbar
  await expect(flowEditorPage.infoSnackbar).toBeVisible();
  await flowEditorPage.screenshot({
    path: 'Published flow.png',
  });

  // unpublish from snackbar
  await flowEditorPage.page.getByTestId('unpublish-flow-from-snackbar').click();
  await expect(flowEditorPage.infoSnackbar).not.toBeVisible();

  // publish once again
  await expect(flowEditorPage.publishFlowButton).toBeVisible();
  await flowEditorPage.publishFlowButton.click();
  await expect(flowEditorPage.publishFlowButton).not.toBeVisible();

  // unpublish from layout top bar
  await expect(flowEditorPage.unpublishFlowButton).toBeVisible();
  await flowEditorPage.unpublishFlowButton.click();
  await expect(flowEditorPage.unpublishFlowButton).not.toBeVisible();
  await flowEditorPage.screenshot({
    path: 'Unpublished flow.png',
  });

  // in layout
  await flowEditorPage.page.getByTestId('editor-go-back-button').click();
  await expect(flowEditorPage.page).toHaveURL('/flows');
});
