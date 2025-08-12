import { test, expect } from '../../fixtures/index';
import { request } from '@playwright/test';
import { publishFlow, addFormsFlow } from '../../helpers/flow-api-helper';
import { getToken } from '../../helpers/auth-api-helper';
import { createForm } from '../../helpers/forms-api-helper';
import Crypto from 'crypto';

test.describe('Forms page', () => {
  test.beforeEach(async ({ formsPage }) => {
    await formsPage.formsDrawerLink.click();
  });

  test('can create a form with only required data', async ({ formsPage }) => {
    await formsPage.createFormButton.click();

    await expect(formsPage.submitFormButton).toBeDisabled();

    await formsPage.nameField.fill('required-only-form');
    await formsPage.displayNameField.fill('required-only-form');

    await formsPage.getFieldNameInput(0).fill('required-field');
    await expect(formsPage.getFieldTypeAutocompleteInput(0)).toHaveValue(
      'String'
    );

    await expect(formsPage.submitFormButton).toBeEnabled();
    await formsPage.submitFormButton.click();

    await expect(
      formsPage.formRow.filter({ hasText: 'required-only-form' })
    ).toHaveCount(1);

    await formsPage.formRow.filter({ hasText: 'required-only-form' }).click();

    await expect(formsPage.nameField).toHaveValue('required-only-form');
    await expect(formsPage.displayNameField).toHaveValue('required-only-form');
    await expect(formsPage.descriptionInput).toHaveValue('');
    await expect(formsPage.submitButtonTextInput).toHaveValue('');
    await expect(formsPage.responseMessageInput).toHaveValue('');

    await expect(formsPage.fieldRow).toHaveCount(1);
    await expect(formsPage.getFieldNameInput(0)).toHaveValue('required-field');
    await expect(formsPage.getFieldTypeAutocompleteInput(0)).toHaveValue(
      'String'
    );
  });

  test('can create a form with required and optional data', async ({
    formsPage,
    page,
  }) => {
    await formsPage.createFormButton.click();

    await expect(formsPage.submitFormButton).toBeDisabled();

    await formsPage.nameField.fill('full-form');
    await formsPage.displayNameField.fill('full-form');
    await formsPage.descriptionInput.fill('description');
    await formsPage.submitButtonTextInput.fill('submitButtonTextInput');
    await formsPage.responseMessageInput.fill('responseMessageInput');

    await formsPage.getFieldNameInput(0).fill('required-field');
    await expect(formsPage.getFieldTypeAutocompleteInput(0)).toHaveValue(
      'String'
    );

    await formsPage.addFieldButton.click();
    await formsPage.getFieldNameInput(1).fill('optional-field');
    await formsPage.getFieldTypeAutocomplete(1).click();
    await page.getByRole('option', { name: 'String' }).click();

    await formsPage.submitFormButton.click();

    await expect(
      formsPage.formRow.filter({ hasText: 'full-form' })
    ).toHaveCount(1);
    await formsPage.formRow.filter({ hasText: 'full-form' }).click();

    await expect(formsPage.nameField).toHaveValue('full-form');
    await expect(formsPage.displayNameField).toHaveValue('full-form');
    await expect(formsPage.descriptionInput).toHaveValue('description');
    await expect(formsPage.submitButtonTextInput).toHaveValue(
      'submitButtonTextInput'
    );
    await expect(formsPage.responseMessageInput).toHaveValue(
      'responseMessageInput'
    );

    await expect(formsPage.fieldRow).toHaveCount(2);
    await expect(formsPage.getFieldNameInput(0)).toHaveValue('required-field');
    await expect(formsPage.getFieldTypeAutocompleteInput(0)).toHaveValue(
      'String'
    );
    await expect(formsPage.getFieldNameInput(1)).toHaveValue('optional-field');
    await expect(formsPage.getFieldTypeAutocompleteInput(1)).toHaveValue(
      'String'
    );
  });

  test('cannot create a form with only optional data', async ({
    formsPage,
  }) => {
    await formsPage.createFormButton.click();
    await formsPage.descriptionInput.fill('description');
    await formsPage.responseMessageInput.fill('responseMessageInput');
    await formsPage.submitButtonTextInput.fill('submitButtonTextInput');
    await expect(formsPage.submitFormButton).toBeDisabled();
  });

  test('cannot create a form without any field filled', async ({
    formsPage,
  }) => {
    await formsPage.createFormButton.click();

    await expect(formsPage.submitFormButton).toBeDisabled();
  });

  test('delete a form not used in a flow', async ({ formsPage }) => {
    //required-only-form
    await formsPage.formRowContextMenuButton('required-only-form').click();
    await formsPage.deleteForm.click();
    // The form has been successfully deleted.
    const snackbar = await formsPage.getSnackbarData(
      'snackbar-delete-form-success'
    );
    await expect(snackbar.variant).toBe('success');
    await expect(formsPage.formRow.filter({ hasText: 'required-only-form' })).toHaveCount(0);
  });

  // TODO feature not working yet
  test.skip('should not remove Form of active flow ', async ({
    formsPage,
    page,
  }) => {
    const apiRequest = await request.newContext();
    const tokenJsonResponse = await getToken(apiRequest);
    const formName = Crypto.randomUUID();

    const form = await createForm(
      apiRequest,
      tokenJsonResponse.data.token,
      formName
    );
    const formId = form.data.id;

    const flowId = await addFormsFlow(
      apiRequest,
      tokenJsonResponse.data.token,
      formId
    );

    await publishFlow(apiRequest, tokenJsonResponse.data.token, flowId);

    await page.goto('/form-entities');
    await expect(formsPage.formRow.filter({ hasText: 'abc' })).toHaveCount(1);
    formsPage.formRowContextMenuButton('abc').click();
    await formsPage.deleteForm.click();
    // should not be able to remove form (UI)
  });
});
