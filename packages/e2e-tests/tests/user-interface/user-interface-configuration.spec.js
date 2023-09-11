// @ts-check
const { test, expect } = require('../../fixtures/index');

test.describe('User interface page', () => {
  test.beforeEach(async ({ userInterfacePage }) => {
    await userInterfacePage.profileMenuButton.click();
    await userInterfacePage.adminMenuItem.click();
    await expect(userInterfacePage.page).toHaveURL(/\/admin-settings\/users/);
    await userInterfacePage.userInterfaceDrawerItem.click();
    await expect(userInterfacePage.page).toHaveURL(
      /\/admin-settings\/user-interface/
    );
    await userInterfacePage.page.waitForURL(/\/admin-settings\/user-interface/);
  });

  test.describe('checks if the shown values are used', async () => {
    test('checks primary main color', async ({ userInterfacePage }) => {
      await userInterfacePage.primaryMainColorInput.waitFor({
        state: 'attached',
      });
      const initialPrimaryMainColor =
        await userInterfacePage.primaryMainColorInput.inputValue();
      const initialRgbColor = userInterfacePage.hexToRgb(
        initialPrimaryMainColor
      );
      await expect(userInterfacePage.updateButton).toHaveCSS(
        'background-color',
        initialRgbColor
      );
    });

    test('checks primary dark color', async ({ userInterfacePage }) => {
      await userInterfacePage.primaryDarkColorInput.waitFor({
        state: 'attached',
      });
      const initialPrimaryDarkColor =
        await userInterfacePage.primaryDarkColorInput.inputValue();
      const initialRgbColor = userInterfacePage.hexToRgb(
        initialPrimaryDarkColor
      );
      await expect(userInterfacePage.appBar).toHaveCSS(
        'background-color',
        initialRgbColor
      );
    });
  });

  test.describe(
    'fill fields and check if the inputs reflect them properly',
    async () => {
      test('fill primary main color and check the color input', async ({
        userInterfacePage,
      }) => {
        await userInterfacePage.primaryMainColorInput.fill('#FF5733');
        const rgbColor = userInterfacePage.hexToRgb('#FF5733');
        const button = await userInterfacePage.primaryMainColorButton;
        const styleAttribute = await button.getAttribute('style');
        expect(styleAttribute).toEqual(`background-color: ${rgbColor};`);
      });

      test('fill primary dark color and check the color input', async ({
        userInterfacePage,
      }) => {
        await userInterfacePage.primaryDarkColorInput.fill('#12F63F');
        const rgbColor = userInterfacePage.hexToRgb('#12F63F');
        const button = await userInterfacePage.primaryDarkColorButton;
        const styleAttribute = await button.getAttribute('style');
        expect(styleAttribute).toEqual(`background-color: ${rgbColor};`);
      });

      test('fill primary light color and check the color input', async ({
        userInterfacePage,
      }) => {
        await userInterfacePage.primaryLightColorInput.fill('#1D0BF5');
        const rgbColor = userInterfacePage.hexToRgb('#1D0BF5');
        const button = await userInterfacePage.primaryLightColorButton;
        const styleAttribute = await button.getAttribute('style');
        expect(styleAttribute).toEqual(`background-color: ${rgbColor};`);
      });
    }
  );

  test.describe('update form based on input values', async () => {
    test('fill primary main color', async ({ userInterfacePage }) => {
      await userInterfacePage.primaryMainColorInput.fill('#00adef');
      await userInterfacePage.updateButton.click();
      await userInterfacePage.snackbar.waitFor({ state: 'visible' });
      await userInterfacePage.screenshot({
        path: 'updated primary main color.png',
      });
    });

    test('fill primary dark color', async ({ userInterfacePage }) => {
      await userInterfacePage.primaryDarkColorInput.fill('#222222');
      await userInterfacePage.updateButton.click();
      await userInterfacePage.snackbar.waitFor({ state: 'visible' });
      await userInterfacePage.screenshot({
        path: 'updated primary dark color.png',
      });
    });

    test.skip('fill primary light color', async ({ userInterfacePage }) => {
      await userInterfacePage.primaryLightColorInput.fill('#f90707');
      await userInterfacePage.updateButton.click();
      await userInterfacePage.goToDashboardButton.click();
      await expect(userInterfacePage.page).toHaveURL('/flows');
      await userInterfacePage.flowRowCardActionArea.waitFor({
        state: 'visible',
      });
      await userInterfacePage.flowRowCardActionArea.hover();
      await userInterfacePage.screenshot({
        path: 'updated primary light color.png',
      });
    });

    test('fill logo svg code', async ({ userInterfacePage }) => {
      await userInterfacePage.logoSvgCodeInput
        .fill(`<svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
      <rect width="100%" height="100%" fill="white" />
      <text x="10" y="40" font-family="Arial" font-size="40" fill="black">A</text>
    </svg>`);
      await userInterfacePage.updateButton.click();
      await userInterfacePage.snackbar.waitFor({ state: 'visible' });
      await userInterfacePage.screenshot({
        path: 'updated svg code.png',
      });
    });
  });

  test.describe(
    'update form based on input values and check if the inputs still reflect them',
    async () => {
      test('update primary main color and check color input', async ({
        userInterfacePage,
      }) => {
        await userInterfacePage.primaryMainColorInput.fill('#00adef');
        await userInterfacePage.updateButton.click();
        await userInterfacePage.snackbar.waitFor({ state: 'visible' });
        const rgbColor = userInterfacePage.hexToRgb('#00adef');
        const button = await userInterfacePage.primaryMainColorButton;
        const styleAttribute = await button.getAttribute('style');
        expect(styleAttribute).toEqual(`background-color: ${rgbColor};`);
      });

      test('update primary dark color and check color input', async ({
        userInterfacePage,
      }) => {
        await userInterfacePage.primaryDarkColorInput.fill('#222222');
        await userInterfacePage.updateButton.click();
        await userInterfacePage.snackbar.waitFor({ state: 'visible' });
        const rgbColor = userInterfacePage.hexToRgb('#222222');
        const button = await userInterfacePage.primaryDarkColorButton;
        const styleAttribute = await button.getAttribute('style');
        expect(styleAttribute).toEqual(`background-color: ${rgbColor};`);
      });

      test('update primary light color and check color input', async ({
        userInterfacePage,
      }) => {
        await userInterfacePage.primaryLightColorInput.fill('#f90707');
        await userInterfacePage.updateButton.click();
        await userInterfacePage.snackbar.waitFor({ state: 'visible' });
        const rgbColor = userInterfacePage.hexToRgb('#f90707');
        const button = await userInterfacePage.primaryLightColorButton;
        const styleAttribute = await button.getAttribute('style');
        expect(styleAttribute).toEqual(`background-color: ${rgbColor};`);
      });
    }
  );
});
