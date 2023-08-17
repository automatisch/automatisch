// @ts-check
const { FlowEditorPage } = require('../../fixtures/flow-editor-page');
const { test, expect } = require('../../fixtures/index');

test.describe.configure({ mode: 'serial' });

let page;
let flowEditorPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  flowEditorPage = new FlowEditorPage(page);
});

test('create flow', async ({}) => {
  await flowEditorPage.login();

  await flowEditorPage.page.getByTestId('create-flow-button').click();
  await expect(flowEditorPage.page).toHaveURL(/\/editor\/create/);
  await expect(flowEditorPage.page).toHaveURL(
    /\/editor\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
  );
});

test('has two steps by default', async ({}) => {
  await expect(flowEditorPage.page.getByTestId('flow-step')).toHaveCount(2);
});

test.describe('arrange Scheduler trigger', () => {
  test.describe('choose app and event substep', () => {
    test('choose application', async ({}) => {
      await flowEditorPage.appAutocomplete.click();
      await flowEditorPage.page
        .getByRole('option', { name: 'Scheduler' })
        .click();
    });

    test('choose an event', async ({}) => {
      await expect(flowEditorPage.eventAutocomplete).toBeVisible();
      await flowEditorPage.eventAutocomplete.click();
      await flowEditorPage.page
        .getByRole('option', { name: 'Every hour' })
        .click();
    });

    test('continue to next step', async ({}) => {
      await flowEditorPage.continueButton.click();
    });

    test('collapses the substep', async ({}) => {
      await expect(flowEditorPage.appAutocomplete).not.toBeVisible();
      await expect(flowEditorPage.eventAutocomplete).not.toBeVisible();
    });
  });

  test.describe('set up a trigger', () => {
    test('choose "yes" in "trigger on weekends?"', async ({}) => {
      await expect(flowEditorPage.trigger).toBeVisible();
      await flowEditorPage.trigger.click();
      await flowEditorPage.page.getByRole('option', { name: 'Yes' }).click();
    });

    test('continue to next step', async ({}) => {
      await flowEditorPage.continueButton.click();
    });

    test('collapses the substep', async ({}) => {
      await expect(flowEditorPage.trigger).not.toBeVisible();
    });
  });

  test.describe('test trigger', () => {
    test('show sample output', async ({}) => {
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

test.describe('arrange Ntfy action', () => {
  test.describe('choose app and event substep', () => {
    test('choose application', async ({}) => {
      await flowEditorPage.appAutocomplete.click();
      await flowEditorPage.page.getByRole('option', { name: 'Ntfy' }).click();
    });

    test('choose an event', async ({}) => {
      await expect(flowEditorPage.eventAutocomplete).toBeVisible();
      await flowEditorPage.eventAutocomplete.click();
      await flowEditorPage.page
        .getByRole('option', { name: 'Send message' })
        .click();
    });

    test('continue to next step', async ({}) => {
      await flowEditorPage.continueButton.click();
    });

    test('collapses the substep', async ({}) => {
      await expect(flowEditorPage.appAutocomplete).not.toBeVisible();
      await expect(flowEditorPage.eventAutocomplete).not.toBeVisible();
    });
  });

  test.describe('choose connection', () => {
    test('choose connection list item', async ({}) => {
      await flowEditorPage.connectionAutocomplete.click();
      await flowEditorPage.page.getByRole('option').first().click();
    });

    test('continue to next step', async ({}) => {
      await flowEditorPage.continueButton.click();
    });

    test('collapses the substep', async ({}) => {
      await expect(flowEditorPage.connectionAutocomplete).not.toBeVisible();
    });
  });

  test.describe('set up action', () => {
    test('fill topic and message body', async ({}) => {
      await flowEditorPage.page
        .getByTestId('parameters.topic-power-input')
        .locator('[contenteditable]')
        .fill('Topic');
      await flowEditorPage.page
        .getByTestId('parameters.message-power-input')
        .locator('[contenteditable]')
        .fill('Message body');
    });

    test('continue to next step', async ({}) => {
      await flowEditorPage.continueButton.click();
    });

    test('collapses the substep', async ({}) => {
      await expect(flowEditorPage.connectionAutocomplete).not.toBeVisible();
    });
  });

  test.describe('test trigger', () => {
    test('show sample output', async ({}) => {
      await expect(flowEditorPage.testOuput).not.toBeVisible();
      await flowEditorPage.page
        .getByTestId('flow-substep-continue-button')
        .first()
        .click();
      await expect(flowEditorPage.testOuput).toBeVisible();
      await flowEditorPage.screenshot({
        path: 'Ntfy action test output.png',
      });
      await flowEditorPage.continueButton.click();
    });
  });
});

test.describe('publish and unpublish', () => {
  test('publish flow', async ({}) => {
    await expect(flowEditorPage.unpublishFlowButton).not.toBeVisible();
    await expect(flowEditorPage.publishFlowButton).toBeVisible();
    await flowEditorPage.publishFlowButton.click();
    await expect(flowEditorPage.publishFlowButton).not.toBeVisible();
  });

  test('shows read-only sticky snackbar', async ({}) => {
    await expect(flowEditorPage.infoSnackbar).toBeVisible();
    await flowEditorPage.screenshot({
      path: 'Published flow.png',
    });
  });

  test('unpublish from snackbar', async ({}) => {
    await flowEditorPage.page
      .getByTestId('unpublish-flow-from-snackbar')
      .click();
    await expect(flowEditorPage.infoSnackbar).not.toBeVisible();
  });

  test('publish once again', async ({}) => {
    await expect(flowEditorPage.publishFlowButton).toBeVisible();
    await flowEditorPage.publishFlowButton.click();
    await expect(flowEditorPage.publishFlowButton).not.toBeVisible();
  });

  test('unpublish from layout top bar', async ({}) => {
    await expect(flowEditorPage.unpublishFlowButton).toBeVisible();
    await flowEditorPage.unpublishFlowButton.click();
    await expect(flowEditorPage.unpublishFlowButton).not.toBeVisible();
    await flowEditorPage.screenshot({
      path: 'Unpublished flow.png',
    });
  });
});

test.describe('in layout', () => {
  test('can go back to flows page', async ({}) => {
    await flowEditorPage.page.getByTestId('editor-go-back-button').click();
    await expect(flowEditorPage.page).toHaveURL('/flows');
  });
});
