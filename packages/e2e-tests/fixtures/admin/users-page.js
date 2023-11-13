const { faker } = require('@faker-js/faker');
const { AuthenticatedPage } = require('../authenticated-page');
const { DeleteUserModal } = require('./delete-user-modal');

faker.seed(9001);

export class AdminUsersPage extends AuthenticatedPage {
  screenshotPath = '/admin';

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.createUserButton = page.getByTestId('create-user');
    this.userRow = page.getByTestId('user-row');
    this.deleteUserModal = new DeleteUserModal(page);
    this.firstPageButton = page.getByTestId('first-page-button');
    this.previousPageButton = page.getByTestId('previous-page-button');
    this.nextPageButton = page.getByTestId('next-page-button');
    this.lastPageButton = page.getByTestId('last-page-button');
    this.usersLoader = page.getByTestId('users-list-loader');
    this.pageTitle = page.getByTestId('users-page-title');
  }

  async navigateTo() {
    await this.profileMenuButton.click();
    await this.adminMenuItem.click();
    await this.isMounted();
    if (await this.usersLoader.isVisible()) {
      await this.usersLoader.waitFor({
        state: 'detached',
      });
    }
  }

  /**
   * @param {string} email
   */
  async getUserRowByEmail(email) {
    return this.userRow.filter({
      has: this.page.getByTestId('user-email').filter({
        hasText: email,
      }),
    });
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async getRowData(row) {
    return {
      fullName: await row.getByTestId('user-full-name').textContent(),
      email: await row.getByTestId('user-email').textContent(),
      role: await row.getByTestId('user-role').textContent(),
    };
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async clickEditUser(row) {
    await row.getByTestId('user-edit').click();
  }

  /**
   * @param {import('@playwright/test').Locator} row
   */
  async clickDeleteUser(row) {
    await row.getByTestId('delete-button').click();
    return this.deleteUserModal;
  }

  /**
   * @param {string} email
   * @returns {import('@playwright/test').Locator | null}
   */
  async findUserPageWithEmail(email) {
    if (await this.usersLoader.isVisible()) {
      await this.usersLoader.waitFor({
        state: 'detached',
      });
    }
    // start at the first page
    const firstPageDisabled = await this.firstPageButton.isDisabled();
    if (!firstPageDisabled) {
      await this.firstPageButton.click();
    }

    while (true) {
      if (await this.usersLoader.isVisible()) {
        await this.usersLoader.waitFor({
          state: 'detached',
        });
      }
      const rowLocator = await this.getUserRowByEmail(email);
      console.log('rowLocator.count', email, await rowLocator.count());
      if ((await rowLocator.count()) === 1) {
        return rowLocator;
      }
      if (await this.nextPageButton.isDisabled()) {
        return null;
      } else {
        await this.nextPageButton.click();
      }
    }
  }

  async getTotalRows() {
    return await this.page.evaluate(() => {
      const node = document.querySelector('[data-total-count]');
      if (node) {
        const count = Number(node.dataset.totalCount);
        if (!isNaN(count)) {
          return count;
        }
      }
      return 0;
    });
  }

  async getRowsPerPage() {
    return await this.page.evaluate(() => {
      const node = document.querySelector('[data-rows-per-page]');
      if (node) {
        const count = Number(node.dataset.rowsPerPage);
        if (!isNaN(count)) {
          return count;
        }
      }
      return 0;
    });
  }
}
