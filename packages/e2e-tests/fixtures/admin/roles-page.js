const { AuthenticatedPage } = require('../authenticated-page');
const { DeleteRoleModal } = require('./delete-role-modal');

export class AdminRolesPage extends AuthenticatedPage {
  screenshotPath = '/admin-roles';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.roleDrawerLink = page.getByTestId('roles-drawer-link');
    this.createRoleButton = page.getByTestId('create-role');
    this.deleteRoleModal = new DeleteRoleModal(page);
    this.roleRow = page.getByTestId('role-row');
    this.rolesLoader = page.getByTestId('roles-list-loader');
    this.pageTitle = page.getByTestId('roles-page-title');
  }

  /**
   *
   * @param {boolean} isMobile - navigation on smaller devices requires the
   * user to open up the drawer menu
   */
  async navigateTo(isMobile = false) {
    await this.profileMenuButton.click();
    await this.adminMenuItem.click();
    if (isMobile) {
      await this.drawerMenuButton.click();
    }
    await this.roleDrawerLink.click();
    await this.isMounted();
    await this.rolesLoader.waitFor({
      state: 'detached'
    });
  }

  /**
   * @param {string} name
   */
  async getRoleRowByName(name) {
    await this.rolesLoader.waitFor({
      state: 'detached',
    });
    return this.roleRow.filter({
      has: this.page.getByTestId('role-name').filter({
        hasText: name,
      }),
    });
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async getRowData(row) {
    return {
      role: await row.getByTestId('role-name').textContent(),
      description: await row.getByTestId('role-description').textContent(),
      canEdit: await row.getByTestId('role-edit').isEnabled(),
      canDelete: await row.getByTestId('role-delete').isEnabled(),
    };
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async clickEditRole(row) {
    await row.getByTestId('role-edit').click();
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async clickDeleteRole(row) {
    await row.getByTestId('role-delete').click();
    return this.deleteRoleModal;
  }

  async editRole(subject) {
    const row = await this.getRoleRowByName(subject);
    await this.clickEditRole(row);
  }
}
