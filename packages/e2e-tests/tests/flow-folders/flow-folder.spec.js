const { test, expect } = require('../../fixtures/index');
const { request } = require('@playwright/test');

const {
  CreateFolderDialog,
} = require('../../fixtures/folder/create-folder-dialog');
const {
  UpdateFolderDialog,
} = require('../../fixtures/folder/update-folder-dialog');
const { MoveFolderDialog } = require('../../fixtures/folder/move-flow-dialog');
const {
  DeleteFolderDialog,
} = require('../../fixtures/folder/delete-folder-dialog');
const { getToken } = require('../../helpers/auth-api-helper');
const { addUser, acceptInvitation } = require('../../helpers/user-api-helper');
const { addFolder } = require('../../helpers/folder-api-helper');
const { createFlow, updateFlowName } = require('../../helpers/flow-api-helper');
import Crypto from 'crypto';

test.describe('Folders', () => {
  test('owner folder lifecycle', async ({
    page,
    flowsPage,
    flowEditorPage,
  }) => {
    const createFolderDialog = new CreateFolderDialog(page);
    const updateFolderDialog = new UpdateFolderDialog(page);
    const folderMoveToDialog = new MoveFolderDialog(page);
    const deleteFolderDialog = new DeleteFolderDialog(page);
    const flowName = Crypto.randomUUID();

    await test.step('new flow should be in uncategorized folder', async () => {
      await flowsPage.createFlowButton.click();
      await flowEditorPage.flowName.click();
      await flowEditorPage.flowNameInput.fill(flowName);
      await flowEditorPage.flowStep.first().click();
      await flowEditorPage.goBackButton.click();
      await expect(page).toHaveURL('/flows');
      await flowsPage.searchInput.fill(flowName);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowName,
        })
      ).toHaveCount(1);
      await flowsPage.uncategorizedFlowsFolder.click();
      await flowsPage.searchInput.fill(flowName);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowName,
        })
      ).toHaveCount(1);
    });

    await test.step('folder name should be at least 1 character long', async () => {
      await flowsPage.addNewFolderButton.click();
      await createFolderDialog.createButton.click();
      await expect(createFolderDialog.errorAlert).toHaveCount(1);
      await createFolderDialog.closeDialog.click();
    });

    await test.step('should be able to add a folder', async () => {
      await flowsPage.addNewFolderButton.click();
      await createFolderDialog.folderNameInput.fill('newFolder');
      await createFolderDialog.createButton.click();
      await expect(createFolderDialog.successAlert).toHaveCount(1);
      await createFolderDialog.closeDialog.click();
      await expect(flowsPage.userFolders.getByText('newFolder')).toHaveCount(1);
      await flowsPage.userFolders.getByText('newFolder').click();
      await expect(flowsPage.flowRow).toHaveCount(0);
    });

    await test.step('should be possible to move flow to the new folder', async () => {
      await flowsPage.allFlowsFolder.click();
      await flowsPage.flowRow
        .filter({
          hasText: flowName,
        })
        .getByRole('button')
        .click();
      await flowsPage.moveTo.click();

      await folderMoveToDialog.folderNameAutocomplete.click();
      await page.getByRole('option', { name: 'newFolder' }).last().click();
      await folderMoveToDialog.moveButton.click();
      await expect(folderMoveToDialog.successAlert).toHaveCount(1);
      await folderMoveToDialog.closeDialog.click();
    });

    await test.step('flow should be visible in the new folder and in all flows folder', async () => {
      await flowsPage.userFolders.getByText('newFolder').click();
      await flowsPage.searchInput.fill(flowName);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowName,
        })
      ).toHaveCount(1);
      await flowsPage.flowRow
        .filter({
          hasText: flowName,
        })
        .click();
      await expect(page).toHaveURL(
        /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
      );
      await expect(flowEditorPage.folderName).toContainText('newFolder');
      await flowEditorPage.goBackButton.click();

      await flowsPage.allFlowsFolder.click();
      await flowsPage.searchInput.fill(flowName);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowName,
        })
      ).toHaveCount(1);
      await flowsPage.uncategorizedFlowsFolder.click();
      await flowsPage.searchInput.fill(flowName);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowName,
        })
      ).toHaveCount(0);
    });

    await test.step('should be able to update a folder', async () => {
      await expect(
        flowsPage.userFolders.getByText('updatedFolderName')
      ).toHaveCount(0);
      await flowsPage.userFolders.getByText('newFolder').first().click();
      await flowsPage.editFolder.click();
      await updateFolderDialog.folderNameInput.fill('updatedFolderName');
      await updateFolderDialog.updateButton.click();
      await expect(updateFolderDialog.successAlert).toHaveCount(1);
      await updateFolderDialog.closeDialog.click();
      await expect(
        flowsPage.userFolders.getByText('updatedFolderName')
      ).toHaveCount(1);
      await flowsPage.flowRow
        .filter({
          hasText: flowName,
        })
        .click();
      await expect(page).toHaveURL(
        /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
      );
      await page.reload();
      await expect(flowEditorPage.folderName).toContainText(
        'updatedFolderName'
      );
      await flowEditorPage.goBackButton.click();
    });

    await test.step('should be able to delete a folder with a flow', async () => {
      await expect(
        flowsPage.userFolders.getByText('updatedFolderName')
      ).toHaveCount(1);

      await flowsPage.deleteFolder.click();
      await deleteFolderDialog.cancelButton.click();
      await flowsPage.deleteFolder.click();
      await deleteFolderDialog.deleteButton.click(),
        await expect(
          flowsPage.userFolders.getByText('updatedFolderName')
        ).toHaveCount(0);
      await expect(flowsPage.deleteFolderSuccessAlert).toHaveCount(1);
      await flowsPage.deleteFolderSuccessAlert.click();
      await expect(flowsPage.deleteFolderSuccessAlert).toHaveCount(0);
      await expect(page).toHaveURL(
        /\/flows\?flowName=[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
      );

      await flowsPage.flowRow
        .filter({
          hasText: flowName,
        })
        .click();
      await expect(page).toHaveURL(
        /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
      );
      await expect(flowEditorPage.folderName).toContainText('Uncategorized');
      await flowEditorPage.goBackButton.click();
    });
  });

  // removal of the empty folder is buggy
  test.skip('should be able to delete empty folder', async ({
    page,
    flowsPage,
    flowEditorPage,
  }) => {
    // add flow
    await flowsPage.createFlowButton.click();
    await flowEditorPage.flowName.click();
    await flowEditorPage.flowNameInput.fill('deleteFlow');
    await flowEditorPage.flowStep.first().click();
    await flowEditorPage.goBackButton.click();
    await expect(page).toHaveURL('/flows');
    // add folder
    await flowsPage.addNewFolderButton.click();
    await createFolderDialog.folderNameInput.fill('deleteFolder');
    await createFolderDialog.createButton.click();
    await expect(createFolderDialog.successAlert).toContainText(
      'The folder has been successfully created!'
    );
    await createFolderDialog.closeDialog.click();
    await expect(flowsPage.userFolders.getByText('deleteFolder')).toHaveCount(
      1
    );
    await flowsPage.userFolders.getByText('deleteFolder').click();
    // move flow
    await flowsPage.allFlowsFolder.click();
    await flowsPage.flowRow
      .filter({
        hasText: 'deleteFlow',
      })
      .getByRole('button')
      .click();
    await flowsPage.moveTo.click();

    await folderMoveToDialog.folderNameAutocomplete.click();
    await page.getByRole('option', { name: 'deleteFolder' }).last().click();
    await folderMoveToDialog.moveButton.click();
    await expect(folderMoveToDialog.successAlert).toHaveCount(1);
    await folderMoveToDialog.closeDialog.click();
    // remove flow
    await flowsPage.allFlowsFolder.click();
    await flowsPage.flowRow
      .filter({
        hasText: 'deleteFlow',
      })
      .getByRole('button')
      .click();
    await flowsPage.delete.click();
    // remove folder
    await flowsPage.userFolders.getByText('deleteFolder').click();
    await flowsPage.deleteFolder.click();
    await deleteFolderDialog.deleteButton.click();
    await expect(flowsPage.userFolders.getByText('deleteFolder')).toHaveCount(
      0
    );
    await expect(flowsPage.deleteFolderSuccessAlert).toHaveCount(1);
  });

  // folder name is not correct (still uncategorized)
  test.skip('should be possible to add flow in the new folder', async ({
    flowsPage,
    flowEditorPage,
  }) => {
    await expect(flowsPage.userFolders.getByText('newFolder')).toHaveCount(1);
    await flowsPage.userFolders.getByText('newFolder').click();
    await flowsPage.createFlowButton.click();
    await expect(flowEditorPage.folderName).toContainText('newFolder');
  });

  test('should be able to add a folder with the same name', async ({
    flowsPage,
    page,
  }) => {
    const createFolderDialog = new CreateFolderDialog(page);

    await flowsPage.addNewFolderButton.click();
    await createFolderDialog.folderNameInput.fill('sameNameFolder');
    await createFolderDialog.createButton.click();
    await expect(createFolderDialog.successAlert).toHaveCount(1);
    await createFolderDialog.closeDialog.click();
    await expect(flowsPage.userFolders.getByText('sameNameFolder')).toHaveCount(
      1
    );

    await flowsPage.addNewFolderButton.click();
    await createFolderDialog.folderNameInput.fill('sameNameFolder');
    await createFolderDialog.createButton.click();
    await expect(createFolderDialog.successAlert).toHaveCount(1);
    await createFolderDialog.closeDialog.click();
    await expect(flowsPage.userFolders.getByText('sameNameFolder')).toHaveCount(
      2
    );
  });

  test('non-owner folder visibility', async ({
    page,
    flowsPage,
    flowEditorPage,
    adminCreateUserPage,
  }) => {
    const apiRequest = await request.newContext();
    const tokenJsonResponse = await getToken(apiRequest);
    let userTokenJsonResponse;
    let flowId;

    await test.step('add another user', async () => {
      adminCreateUserPage.seed(
        Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)
      );
      const testUser = adminCreateUserPage.generateUser();

      const addUserResponse = await addUser(
        apiRequest,
        tokenJsonResponse.data.token,
        {
          fullName: testUser.fullName,
          email: testUser.email,
        }
      );

      const acceptToken =
        addUserResponse.data.acceptInvitationUrl.split('=')[1];
      await acceptInvitation(apiRequest, {
        token: acceptToken,
        password: 'alamakota',
      });
      userTokenJsonResponse = await getToken(
        apiRequest,
        testUser.email,
        'alamakota'
      );
    });

    await test.step('add folder as an another user', async () => {
      await addFolder(
        apiRequest,
        userTokenJsonResponse.data.token,
        'anotherUserFolder'
      );
    });

    await test.step('add folder as a main user', async () => {
      await addFolder(
        apiRequest,
        tokenJsonResponse.data.token,
        'mainUserFolder'
      );
    });

    await test.step('add flow as an another user', async () => {
      const flow = await createFlow(
        apiRequest,
        userTokenJsonResponse.data.token
      );
      flowId = flow.data.id;
      await updateFlowName(
        apiRequest,
        userTokenJsonResponse.data.token,
        flowId
      );
      await page.reload();
    });

    await test.step('should not see folders of different user on the list', async () => {
      await expect(
        flowsPage.userFolders.getByText('anotherUserFolder')
      ).toHaveCount(0);
    });

    await test.step('should not see folders of different user in the flow details', async () => {
      await flowsPage.flowRow
        .filter({
          hasText: flowId,
        })
        .click();
      await expect(page).toHaveURL(
        /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
      );
      await expect(flowEditorPage.folderName).toContainText('Uncategorized');
      await flowEditorPage.goBackButton.click();
    });

    await test.step("another user's flow should be uncategorized and in all flows folder", async () => {
      await flowsPage.allFlowsFolder.click();
      await flowsPage.searchInput.fill(flowId);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowId,
        })
      ).toHaveCount(1);
      await flowsPage.uncategorizedFlowsFolder.click();
      await flowsPage.searchInput.fill(flowId);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowId,
        })
      ).toHaveCount(1);
      await flowsPage.userFolders.getByText('mainUserFolder').click();
      await flowsPage.searchInput.fill(flowId);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowId,
        })
      ).toHaveCount(0);
    });
  });

  test('non-owner should not reassign folder of different user', async ({
    page,
    flowsPage,
    adminCreateUserPage,
  }) => {
    const folderMoveToDialog = new MoveFolderDialog(page);
    const apiRequest = await request.newContext();
    const tokenJsonResponse = await getToken(apiRequest);
    let userTokenJsonResponse;
    let flowId;

    await test.step('add another user', async () => {
      adminCreateUserPage.seed(
        Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)
      );
      const testUser = adminCreateUserPage.generateUser();

      const addUserResponse = await addUser(
        apiRequest,
        tokenJsonResponse.data.token,
        {
          fullName: testUser.fullName,
          email: testUser.email,
        }
      );

      const acceptToken =
        addUserResponse.data.acceptInvitationUrl.split('=')[1];
      await acceptInvitation(apiRequest, {
        token: acceptToken,
        password: 'alamakota',
      });
      userTokenJsonResponse = await getToken(
        apiRequest,
        testUser.email,
        'alamakota'
      );
    });

    await test.step('add folder as an another user', async () => {
      await addFolder(
        apiRequest,
        userTokenJsonResponse.data.token,
        'anotherUserFolder'
      );
    });

    await test.step('add flow as an another user', async () => {
      const flow = await createFlow(
        apiRequest,
        userTokenJsonResponse.data.token
      );
      flowId = flow.data.id;
      await updateFlowName(
        apiRequest,
        userTokenJsonResponse.data.token,
        flowId
      );
      await page.reload();
    });

    await test.step("should not be able to move another user's flow", async () => {
      await flowsPage.allFlowsFolder.click();
      await flowsPage.searchInput.fill(flowId);
      await expect(
        flowsPage.flowRow.filter({
          hasText: flowId,
        })
      ).toHaveCount(1);

      await flowsPage.flowRow
        .filter({
          hasText: flowId,
        })
        .getByRole('button')
        .click();
      await flowsPage.moveTo.click();

      await expect(
        page.getByText(
          'A flow can only be moved to a folder by the flow owner.'
        )
      ).toHaveCount(1);

      await expect(folderMoveToDialog.moveButton).toBeDisabled();
    });
  });
});
