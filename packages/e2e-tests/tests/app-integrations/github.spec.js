const { test, expect } = require('../../fixtures');

test('Github OAuth integration', async ({ page, applicationsPage }) => {
  const githubConnectionPage = await test.step(
    'Navigate to github connections modal',
    async () => {
      await applicationsPage.drawerLink.click();
      if (page.url() !== '/apps') {
        await page.waitForURL('/apps');
      }
      const connectionModal = await applicationsPage.openAddConnectionModal();
      await expect(connectionModal.modal).toBeVisible();
      return await connectionModal.selectLink('github');
    }
  );

  const connectionModal = await test.step(
    'Ensure the github connection modal is visible',
    async () => {
      const connectionModal = githubConnectionPage.addConnectionModal;
      await expect(connectionModal.modal).toBeVisible();
      return connectionModal;
    }
  );

  const githubPopup = await test.step(
    'Input data into the add connection form and submit',
    async () => {
      await connectionModal.clientIdInput.fill(process.env.GITHUB_CLIENT_ID);
      await connectionModal.clientIdSecretInput.fill(
        process.env.GITHUB_CLIENT_SECRET
      );
      return await connectionModal.submit();
    }
  );

  await test.step('Ensure github popup is not a 404', async () => {
    // await expect(githubPopup).toBeVisible();
    const title = await githubPopup.title();
    await expect(title).not.toMatch(/^Page not found/);
  });

  /* Skip these in CI
  await test.step(
    'Handle github popup authentication flow',
    async () => {
      await connectionModal.handlePopup(githubPopup);
    }
  );

  await test.step(
    'Ensure the new connection is added to the connections list',
    async () => {
      await page.locator('body').click({ position: { x: 0, y: 0 } });
      // TODO
    }
  );
  */
});

test.afterAll(async () => {
  // TODO - Remove connections from github connections page
});