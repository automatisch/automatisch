import { test, expect } from '@playwright/test';
import { ApplicationsPage } from './applications-page';
import { ConnectionsPage } from './connections-page';
import { ExecutionsPage } from './executions-page';
import { ExecutionDetailsPage } from './execution-details-page';
import { FlowEditorPage } from './flow-editor-page';
import { UserInterfacePage } from './user-interface-page';
import { LoginPage } from './login-page';
import { AcceptInvitation } from './accept-invitation-page';
import { adminFixtures } from './admin';
import { AdminSetupPage } from './admin-setup-page';
import { AdminCreateUserPage } from './admin/create-user-page';
import { FlowsPage } from './flows-page';
import { TemplatesPage } from './templates/templates-page';
import { StepDetailsSidebar } from './step-details-sidebar';
import { FormsPage } from './forms/forms-page';

exports.test = test.extend({
  page: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();

    await expect(loginPage.loginButton).not.toBeVisible();
    await expect(page).toHaveURL('/flows');

    await use(page);
  },
  applicationsPage: async ({ page }, use) => {
    await use(new ApplicationsPage(page));
  },
  connectionsPage: async ({ page }, use) => {
    await use(new ConnectionsPage(page));
  },
  executionsPage: async ({ page }, use) => {
    await use(new ExecutionsPage(page));
  },
  executionDetailsPage: async ({ page }, use) => {
    await use(new ExecutionDetailsPage(page));
  },
  flowEditorPage: async ({ page }, use) => {
    await use(new FlowEditorPage(page));
  },
  flowsPage: async ({ page }, use) => {
    await use(new FlowsPage(page));
  },
  templatesPage: async ({ page }, use) => {
    await use(new TemplatesPage(page));
  },
  formsPage: async ({ page }, use) => {
    await use(new FormsPage(page));
  },
  userInterfacePage: async ({ page }, use) => {
    await use(new UserInterfacePage(page));
  },
  stepDetailsSidebar: async ({ page }, use) => {
    await use(new StepDetailsSidebar(page));
  },
  ...adminFixtures,
});

exports.publicTest = test.extend({
  page: async ({ page }, use) => {
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    await use(loginPage);
  },
  acceptInvitationPage: async ({ page }, use) => {
    const acceptInvitationPage = new AcceptInvitation(page);
    await use(acceptInvitationPage);
  },
  adminSetupPage: async ({ page }, use) => {
    const adminSetupPage = new AdminSetupPage(page);
    await use(adminSetupPage);
  },
  adminCreateUserPage: async ({ page }, use) => {
    const adminCreateUserPage = new AdminCreateUserPage(page);
    await use(adminCreateUserPage);
  },
});

expect.extend({
  toBeClickableLink: async (locator) => {
    await expect(locator).not.toHaveAttribute('aria-disabled', 'true');

    return { pass: true };
  },
});

exports.expect = expect;
