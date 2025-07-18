import { getToken } from '../../helpers/auth-api-helper.js';
import {
  createFlow,
  updateFlowName,
  getFlow,
  updateFlowStep,
  testStep,
  createConnection,
  verifyConnection,
} from '../../helpers/flow-api-helper.js';
import { AuthenticatedPage } from '../authenticated-page.js';

export class TemplatesPage extends AuthenticatedPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.switch = page.getByTestId('switch').locator('input');
    this.searchInput = page.getByTestId('search-input');
    this.templateRowLocator = page.getByTestId('template-row');
    this.templateRow = (templateName) =>
      this.templateRowLocator.filter({ hasText: templateName });
    this.templateButton = (templateName) =>
      this.templateRowLocator
        .filter({ hasText: templateName })
        .getByRole('button');
    this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    this.templateNameInput = page.getByTestId('template-name-input');

    this.createButton = page.getByTestId('create-button');
    this.updateButton = page.getByTestId('update-button');
    this.updateAlert = page.getByTestId('update-alert');
  }

  async navigateTo() {
    await this.page.goto('/admin-settings/templates');
  }

  async prepareFlowViaAPI(request) {
    const tokenJsonResponse = await getToken(request);
    const token = tokenJsonResponse.data.token;
    const flow = await createFlow(request, token);
    const flowId = flow.data.id;
    await updateFlowName(request, token, flowId);
    return { token, flow, flowId };
  }

  async setupComplexFlow(request, token, flowId) {
    const updatedFlow = await getFlow(request, token, flowId);
    const flowSteps = updatedFlow.data.steps;

    const triggerStepId = flowSteps.find((step) => step.type === 'trigger').id;
    const actionStepId = flowSteps.find((step) => step.type === 'action').id;

    const triggerStep = await updateFlowStep(request, token, triggerStepId, {
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'triggerStep',
      parameters: { workSynchronously: true },
    });
    await request.get(triggerStep.data.webhookUrl);
    await testStep(request, token, triggerStepId);

    const connection = await createConnection(request, token, 'postgresql', {
      formattedData: {
        version: '14.5',
        host: process.env.POSTGRES_HOST,
        port: '5432',
        enableSsl: 'false',
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
      },
    });

    await verifyConnection(request, token, connection.data.id);
    await updateFlowStep(request, token, actionStepId, {
      appKey: 'postgresql',
      key: 'SQLQuery',
      name: 'SQLQuery!',
      connectionId: connection.data.id,
      parameters: {
        queryStatement: `select * from users where test={{step.${triggerStepId}.headers.host}};`,
        params: [{ parameter: '', value: '' }],
      },
    });
    await testStep(request, token, actionStepId);
  }
}
