const { test, expect } = require('../../fixtures/index');
const {AddMattermostConnectionModal} = require('../../fixtures/apps/mattermost/add-mattermost-connection-modal');

test.describe('Pop-up message on connections', () => {
  test.beforeEach(async ({ flowEditorPage, page }) => {
    await page.getByTestId('create-flow-button').click();
    await page.waitForURL(
      /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );
    await expect(page.getByTestId('flow-step')).toHaveCount(2);

    await flowEditorPage.flowName.click();
    await flowEditorPage.flowNameInput.fill('PopupFlow');
    await flowEditorPage.createWebhookTrigger(true);

    await flowEditorPage.chooseAppAndEvent('Mattermost', 'Send a message to channel');
    await expect(flowEditorPage.continueButton).toHaveCount(1);
    await expect(flowEditorPage.continueButton).not.toBeEnabled();

    await flowEditorPage.connectionAutocomplete.click();
    await flowEditorPage.addNewConnectionItem.click();  });

  test('should show error to remind to enable pop-up on connection create', async ({
    page,
  }) => {
    const addMattermostConnectionModal = new AddMattermostConnectionModal(page);

    // Inject script to override window.open
    await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      window.open = function() {
        console.log('Popup blocked!');
        return null;
      };
    });

    await addMattermostConnectionModal.fillConnectionForm();
    await addMattermostConnectionModal.submitConnectionForm();

    await expect(page.getByTestId("add-connection-error")).toHaveCount(1);
    await expect(page.getByTestId("add-connection-error")).toHaveText('Make sure pop-ups are enabled in your browser.');
  });

  test('should not show pop-up error if pop-ups are enabled on connection create', async ({
    page,
  }) => {
    const addMattermostConnectionModal = new AddMattermostConnectionModal(page);

    await addMattermostConnectionModal.fillConnectionForm();
    const popupPromise = page.waitForEvent('popup');
    await addMattermostConnectionModal.submitConnectionForm();

    const popup = await popupPromise;
    await expect(popup.url()).toContain("mattermost");
    await expect(page.getByTestId("add-connection-error")).toHaveCount(0);

    await test.step('Should show error on failed credentials verification', async () => {
      await popup.close();
      await expect(page.getByTestId("add-connection-error")).toHaveCount(1);
      await expect(page.getByTestId("add-connection-error")).toHaveText('Error occured while verifying credentials!');
    });
  });
});