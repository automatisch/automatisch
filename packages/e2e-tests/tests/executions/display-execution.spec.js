// @ts-check
const { test, expect } = require('../../fixtures/index');

// no execution data exists in an empty account
test.describe.skip('Executions page', () => {
  test.beforeEach(async ({ page, executionsPage }) => {
    await page.getByTestId('executions-page-drawer-link').click();
    await page.getByTestId('execution-row').first().click();

    await expect(page).toHaveURL(/\/executions\//);
  });

  test('displays data in by default', async ({ page, executionsPage }) => {
    await expect(page.getByTestId('execution-step').last()).toBeVisible();
    await expect(page.getByTestId('execution-step')).toHaveCount(2);

    await executionsPage.screenshot({
      path: 'Execution - data in.png',
    });
  });

  test('displays data out', async ({ page, executionsPage }) => {
    const executionStepCount = await page.getByTestId('execution-step').count();
    for (let i = 0; i < executionStepCount; i++) {
      await page.getByTestId('data-out-tab').nth(i).click();
      await expect(page.getByTestId('data-out-panel').nth(i)).toBeVisible();

      await executionsPage.screenshot({
        path: `Execution - data out - ${i}.png`,
        animations: 'disabled',
      });
    }
  });

  test('does not display error', async ({ page }) => {
    await expect(page.getByTestId('error-tab')).toBeHidden();
  });
});
