export class RoleConditionsModal {

  /**
   * @param {import('@playwright/test').Page} page 
   * @param {('Connection'|'Execution'|'Flow')} subject
   */
  constructor (page, subject) {
    this.page = page;
    this.modal = page.getByTestId(`${subject}-role-conditions-modal`);
    this.modalBody = this.modal.getByTestId('role-conditions-modal-body');
    this.createCheckbox = this.modal.getByTestId(
      'isCreator-create-checkbox'
    ).locator('input');
    this.readCheckbox = this.modal.getByTestId(
      'isCreator-read-checkbox'
    ).locator('input');
    this.updateCheckbox = this.modal.getByTestId(
      'isCreator-update-checkbox'
    ).locator('input');
    this.deleteCheckbox = this.modal.getByTestId(
      'isCreator-delete-checkbox'
    ).locator('input');
    this.publishCheckbox = this.modal.getByTestId(
      'isCreator-publish-checkbox'
    ).locator('input');
    this.applyButton = this.modal.getByTestId('confirmation-confirm-button');
    this.cancelButton = this.modal.getByTestId('confirmation-cancel-button');
  }

  async getAvailableConditions () {
    let conditions = {};
    const actions = ['create', 'read', 'update', 'delete', 'publish'];
    for (let action of actions) {
      const locator = this[`${action}Checkbox`];
      if (locator && await locator.count() > 0) {
        conditions[action] = locator;
      }
    }
    return conditions;
  }

  async close () {
    await this.page.click('body', {
      position: { x: 10, y: 10 }
    });
  }
}