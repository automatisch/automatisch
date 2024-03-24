// @ts-check
const { test, expect } = require('../../fixtures/index');

test('Ensure creating a new flow works', async ({ page }) => {
  await page.getByTestId('create-flow-button').click();
  await expect(page).toHaveURL(/\/editor\/create/);
  await expect(page).toHaveURL(
    /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
  );
});

test('Create a new flow with a Scheduler step then an Ntfy step', async ({
  flowEditorPage,
  page,
}) => {
  test.slow();
  await test.step('create flow', async () => {
    await test.step('navigate to new flow page', async () => {
      await page.getByTestId('create-flow-button').click();
      await page.waitForURL(
        /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
      );
    });

    await test.step('has two steps by default', async () => {
      await expect(page.getByTestId('flow-step')).toHaveCount(2);
    });
  });

  await test.step('setup Scheduler trigger', async () => {
    await test.step('choose app and event substep', async () => {
      await test.step('choose application', async () => {
        await flowEditorPage.appAutocomplete.click();
        await page.getByRole('option', { name: 'Scheduler' }).click();
      });

      await test.step('choose and event', async () => {
        await expect(flowEditorPage.eventAutocomplete).toBeVisible();
        await flowEditorPage.eventAutocomplete.click();
        await page.getByRole('option', { name: 'Every hour' }).click();
      });

      await test.step('continue to next step', async () => {
        await flowEditorPage.continueButton.click();
      });

      await test.step('collapses the substep', async () => {
        await expect(flowEditorPage.appAutocomplete).not.toBeVisible();
        await expect(flowEditorPage.eventAutocomplete).not.toBeVisible();
      });
    });

    await test.step('set up a trigger', async () => {
      await test.step('choose "yes" in "trigger on weekends?"', async () => {
        await expect(flowEditorPage.trigger).toBeVisible();
        await flowEditorPage.trigger.click();
        await page.getByRole('option', { name: 'Yes' }).click();
      });

      await test.step('continue to next step', async () => {
        await flowEditorPage.continueButton.click();
      });

      await test.step('collapses the substep', async () => {
        await expect(flowEditorPage.trigger).not.toBeVisible();
      });
    });

    await test.step('test trigger', async () => {
      await test.step('show sample output', async () => {
        await expect(flowEditorPage.testOuput).not.toBeVisible();
        await flowEditorPage.continueButton.click();
        await expect(flowEditorPage.testOuput).toBeVisible();
        await flowEditorPage.screenshot({
          path: 'Scheduler trigger test output.png',
        });
        await flowEditorPage.continueButton.click();
      });
    });
  });

  await test.step('arrange Ntfy action', async () => {
    await test.step('choose app and event substep', async () => {
      await test.step('choose application', async () => {
        await flowEditorPage.appAutocomplete.click();
        await page.getByRole('option', { name: 'Ntfy' }).click();
      });

      await test.step('choose an event', async () => {
        await expect(flowEditorPage.eventAutocomplete).toBeVisible();
        await flowEditorPage.eventAutocomplete.click();
        await page.getByRole('option', { name: 'Send message' }).click();
      });

      await test.step('continue to next step', async () => {
        await flowEditorPage.continueButton.click();
      });

      await test.step('collapses the substep', async () => {
        await expect(flowEditorPage.appAutocomplete).not.toBeVisible();
        await expect(flowEditorPage.eventAutocomplete).not.toBeVisible();
      });
    });

    await test.step('choose connection substep', async () => {
      await test.step('choose connection list item', async () => {
        await flowEditorPage.connectionAutocomplete.click();
        await page.getByRole('option').first().click();
      });
      await test.step('create connection if needed', async () => {
        const connectionButton = page.getByTestId('create-connection-button');
        if (
          await connectionButton.isVisible({
            timeout: 3000,
          })
        ) {
          await connectionButton.click();
        }
      });

      await test.step('continue to next step', async () => {
        await flowEditorPage.continueButton.click();
      });

      await test.step('collapses the substep', async () => {
        await expect(flowEditorPage.connectionAutocomplete).not.toBeVisible();
      });
    });

    await test.step('set up action substep', async () => {
      await test.step('fill topic and message body', async () => {
        await page
          .getByTestId('parameters.topic-power-input')
          .locator('[contenteditable]')
          .fill('Topic');
        await page
          .getByTestId('parameters.message-power-input')
          .locator('[contenteditable]')
          .fill('Message body');
      });

      await test.step('continue to next step', async () => {
        await flowEditorPage.continueButton.click();
      });

      await test.step('collapses the substep', async () => {
        await expect(flowEditorPage.connectionAutocomplete).not.toBeVisible();
      });
    });

    await test.step('test trigger substep', async () => {
      await test.step('show sample output', async () => {
        await expect(flowEditorPage.testOuput).not.toBeVisible();
        await page.getByTestId('flow-substep-continue-button').first().click();
        await expect(flowEditorPage.testOuput).toBeVisible();
        await flowEditorPage.screenshot({
          path: 'Ntfy action test output.png',
        });
        await flowEditorPage.continueButton.click();
      });
    });
  });

  await test.step('publish and unpublish', async () => {
    await test.step('publish flow', async () => {
      await expect(flowEditorPage.unpublishFlowButton).not.toBeVisible();
      await expect(flowEditorPage.publishFlowButton).toBeVisible();
      await flowEditorPage.publishFlowButton.click();
      await expect(flowEditorPage.publishFlowButton).not.toBeVisible();
    });

    await test.step('shows read-only sticky snackbar', async () => {
      await expect(flowEditorPage.infoSnackbar).toBeVisible();
      await flowEditorPage.screenshot({
        path: 'Published flow.png',
      });
    });

    await test.step('unpublish from snackbar', async () => {
      await page.getByTestId('unpublish-flow-from-snackbar').click();
      await expect(flowEditorPage.infoSnackbar).not.toBeVisible();
    });

    await test.step('publish once again', async () => {
      await expect(flowEditorPage.publishFlowButton).toBeVisible();
      await flowEditorPage.publishFlowButton.click();
      await expect(flowEditorPage.publishFlowButton).not.toBeVisible();
    });

    await test.step('unpublish from layout top bar', async () => {
      await expect(flowEditorPage.unpublishFlowButton).toBeVisible();
      await flowEditorPage.unpublishFlowButton.click();
      await expect(flowEditorPage.unpublishFlowButton).not.toBeVisible();
      await flowEditorPage.screenshot({
        path: 'Unpublished flow.png',
      });
    });
  });

  await test.step('in layout', async () => {
    await test.step('can go back to flows page', async () => {
      await page.getByTestId('editor-go-back-button').click();
      await expect(page).toHaveURL('/flows');
    });
  });
});
