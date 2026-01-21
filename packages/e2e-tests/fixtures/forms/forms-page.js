const { AuthenticatedPage } = require('../authenticated-page');

export class FormsPage extends AuthenticatedPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.createFormButton = page.getByTestId('create-form-button');

    this.submitFormButton = page.getByTestId('submit-form-editor-button');
    this.updateFormButton = page.getByTestId('submit-form-editor-button');
    this.formRow = page.getByTestId('form-row');
    this.deleteForm = page.getByTestId('delete-form');
    this.formRowContextMenuButton = (formRowName) =>
      this.formRow
        .filter({ hasText: formRowName })
        .getByTestId('context-menu-button');

    this.addFieldButton = page.getByTestId('add-field-button');
    this.removeFieldButton = page.getByTestId('remove-field-button');
    this.fieldRow = page.getByTestId('field-row');
    this.getFieldRow = (index) => page.getByTestId('field-row').nth(index);

    // Form fields
    this.nameField = page.getByTestId('name');
    this.displayNameField = page.getByTestId('display-name');
    this.descriptionInput = page.getByTestId('description');
    this.responseMessageInput = page.getByTestId('response-message');
    this.submitButtonTextInput = page.getByTestId('submit-button-text');

    // Field configuration methods
    this.getFieldNameInput = (index) =>
      page.getByTestId(`fields.${index}.name`);
    this.getFieldTypeAutocomplete = (index) =>
      page.getByTestId(`fields.${index}.type-autocomplete`);
    this.getFieldTypeAutocompleteInput = (index) =>
      this.getFieldTypeAutocomplete(index).locator('input');
    this.getFieldValidationFormat = (index) =>
      page.getByTestId(`fields.${index}.validationFormat-autocomplete`);

    // custom pattern
    this.getFieldValidationMessage = (index) =>
      page.getByTestId(`fields.${index}.validationHelperText`);
    this.getFieldValidationPattern = (index) =>
      page.getByTestId(`fields.${index}.validationPattern`);

    // dropdown
    this.getDropdownOptionValueInput = (index, optionIndex) =>
      page.getByTestId(`fields.${index}.options.${optionIndex}.value`);

    //  field checkboxes
    this.getFieldRequiredCheckbox = (index) =>
      page.getByTestId(`fields.${index}.required`);
    this.getFieldReadonlyCheckbox = (index) =>
      page.getByTestId(`fields.${index}.readonly`);

    this.minArrayFields = (index) =>
      page.getByTestId(`fields.${index}.minItems`);
    this.maxArrayFields = (index) =>
      page.getByTestId(`fields.${index}.maxItems`);

    this.getArrayFieldName = (index, fieldIndex) =>
      page.getByTestId(`fields.${index}.fields.${fieldIndex}.name`);
    this.getArrayFieldType = (index, fieldIndex) =>
      page.getByTestId(`fields.${index}.fields.${fieldIndex}.type`);

    this.addArrayFieldButton = page.getByTestId('add-array-field-button');

    // array field checkboxes
    this.getArrayFieldRequiredCheckbox = (index, fieldIndex) =>
      page.getByTestId(`fields.${index}.fields.${fieldIndex}.required`);
    this.getArrayFieldReadonlyCheckbox = (index, fieldIndex) =>
      page.getByTestId(`fields.${index}.fields.${fieldIndex}.readonly`);

    this.getArrayFieldValidationFormat = (index, fieldIndex) =>
      page.getByTestId(
        `fields.${index}.fields.${fieldIndex}.validationFormat-autocomplete`
      );
    this.getArrayFieldValidationPattern = (index, fieldIndex) =>
      page.getByTestId(
        `fields.${index}.fields.${fieldIndex}.validationPattern`
      );
    this.getArrayFieldValidationHelperText = (index, fieldIndex) =>
      page.getByTestId(
        `fields.${index}.fields.${fieldIndex}.validationHelperText`
      );

    this.getArrayFieldOptionValueInput = (index, fieldIndex, optionIndex) =>
      page.getByTestId(
        `fields.${index}.fields.${fieldIndex}.options.${optionIndex}.value`
      );

    this.getArrayFieldAddOptionButton = (index, fieldIndex) =>
      page.getByTestId(`add-subfield-option-button-${fieldIndex}`);
    this.getArrayFieldRemoveOptionButton = (optionIndex) =>
      page.getByTestId(`remove-subfield-option-${optionIndex}`);

    // flow
    this.submitFormFlowButton = page.getByTestId('submit-form-button');
    this.formFlowAlert = page.getByTestId('form-alert');
  }
}
