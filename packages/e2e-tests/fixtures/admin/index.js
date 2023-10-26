const { AdminCreateUserPage } = require('./create-user-page');
const { AdminEditUserPage } = require('./edit-user-page');
const { AdminUsersPage } = require('./users-page');

export const adminFixtures = {
  adminUsersPage: async ({ page }, use) => {
    await use(new AdminUsersPage(page));
  },
  adminCreateUserPage: async ({ page }, use) => {
    await use(new AdminCreateUserPage(page));
  },
  adminEditUserPage: async ({page}, use) => {
    await use(new AdminEditUserPage(page));
  }
}