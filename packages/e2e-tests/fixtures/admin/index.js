const { AdminCreateUserPage } = require('./create-user-page');
const { AdminEditUserPage } = require('./edit-user-page');
const { AdminUsersPage } = require('./users-page');

const { AdminRolesPage } = require('./roles-page');
const { AdminCreateRolePage } = require('./create-role-page');
const { AdminEditRolePage } = require('./edit-role-page');

const { AdminApplicationsPage } = require('./applications-page');
const { AdminApplicationSettingsPage } = require('./application-settings-page');
const {
  AdminApplicationOAuthClientsPage,
} = require('./application-oauth-clients-page');

export const adminFixtures = {
  adminUsersPage: async ({ page }, use) => {
    await use(new AdminUsersPage(page));
  },
  adminCreateUserPage: async ({ page }, use) => {
    await use(new AdminCreateUserPage(page));
  },
  adminEditUserPage: async ({ page }, use) => {
    await use(new AdminEditUserPage(page));
  },
  adminRolesPage: async ({ page }, use) => {
    await use(new AdminRolesPage(page));
  },
  adminEditRolePage: async ({ page }, use) => {
    await use(new AdminEditRolePage(page));
  },
  adminCreateRolePage: async ({ page }, use) => {
    await use(new AdminCreateRolePage(page));
  },
  adminApplicationsPage: async ({ page }, use) => {
    await use(new AdminApplicationsPage(page));
  },
  adminApplicationSettingsPage: async ({ page }, use) => {
    await use(new AdminApplicationSettingsPage(page));
  },
  adminApplicationOAuthClientsPage: async ({ page }, use) => {
    await use(new AdminApplicationOAuthClientsPage(page));
  },
};
