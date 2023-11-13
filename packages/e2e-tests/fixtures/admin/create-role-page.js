const { AuthenticatedPage } = require('../authenticated-page');
const { RoleConditionsModal } = require('./role-conditions-modal');

export class AdminCreateRolePage extends AuthenticatedPage {
  screenshotPath = '/admin/create-role';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.nameInput = page.getByTestId('name-input');
    this.descriptionInput = page.getByTestId('description-input');
    this.createButton = page.getByTestId('create-button');
    this.connectionRow = page.getByTestId('Connection-permission-row');
    this.executionRow = page.getByTestId('Execution-permission-row');
    this.flowRow = page.getByTestId('Flow-permission-row');
    this.pageTitle = page.getByTestId('create-role-title');
  }

  /**
   * @param {('Connection'|'Execution'|'Flow')} subject
   */
  getRoleConditionsModal(subject) {
    return new RoleConditionsModal(this.page, subject);
  }

  async getPermissionConfigs() {
    const subjects = ['Connection', 'Flow', 'Execution'];
    const permissionConfigs = [];
    for (let subject of subjects) {
      const row = this.getSubjectRow(subject);
      const actionInputs = await this.getRowInputs(row);
      Object.keys(actionInputs).forEach((action) => {
        permissionConfigs.push({
          action,
          locator: actionInputs[action],
          subject,
          row,
        });
      });
    }
    return permissionConfigs;
  }

  /**
   *
   * @param {(
   *   'Connection' | 'Flow' | 'Execution'
   * )} subject
   */
  getSubjectRow(subject) {
    const k = `${subject.toLowerCase()}Row`;
    if (this[k]) {
      return this[k];
    } else {
      throw 'Unknown row';
    }
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async getRowInputs(row) {
    const inputs = {
      // settingsButton: row.getByTestId('permission-settings-button')
    };
    for (let input of ['create', 'read', 'update', 'delete', 'publish']) {
      const testId = `${input}-checkbox`;
      if ((await row.getByTestId(testId).count()) > 0) {
        inputs[input] = row.getByTestId(testId).locator('input');
      }
    }
    return inputs;
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async clickPermissionSettings(row) {
    await row.getByTestId('permission-settings-button').click();
  }

  /**
   *
   * @param {string} subject
   * @param {'create'|'read'|'update'|'delete'|'publish'} action
   * @param {boolean} val
   */
  async updateAction(subject, action, val) {
    const row = await this.getSubjectRow(subject);
    const inputs = await this.getRowInputs(row);
    if (inputs[action]) {
      if (await inputs[action].isChecked()) {
        if (!val) {
          await inputs[action].click();
        }
      } else {
        if (val) {
          await inputs[action].click();
        }
      }
    } else {
      throw new Error(`${subject} does not have action ${action}`);
    }
  }
}
