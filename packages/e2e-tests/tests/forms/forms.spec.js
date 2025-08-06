import { test, expect } from '../../fixtures/index';

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
});
