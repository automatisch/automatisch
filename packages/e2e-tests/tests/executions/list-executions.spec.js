// @ts-check
const { test, expect } = require('../../fixtures/index');

test.describe('Executions page', () => {
  test.beforeEach(async ({ page, executionsPage }) => {
    await page.getByTestId('executions-page-drawer-link').click();
  });

  // no executions exist in an empty account
  test.skip('displays executions', async ({ page, executionsPage }) => {
    await page.getByTestId('executions-loader').waitFor({
      state: 'detached',
    });
    await expect(page.getByTestId('execution-row').first()).toBeVisible();

    await executionsPage.screenshot({ path: 'Executions.png' });
  });
});
