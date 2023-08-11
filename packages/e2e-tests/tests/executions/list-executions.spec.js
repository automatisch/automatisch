// @ts-check
const { test, expect } = require('../../fixtures/index');

test.describe('Executions page', () => {
  test.beforeEach(async ({ page, executionsPage }) => {
    await executionsPage.login();

    await page.getByTestId('executions-page-drawer-link').click();
  });

  test('displays executions', async ({ page, executionsPage }) => {
    await page.getByTestId('executions-loader').waitFor({
      state: 'detached',
    });
    await expect(page.getByTestId('execution-row').first()).toBeVisible();

    await executionsPage.screenshot({ path: 'Executions.png' });
  });
});
