import Template from '../../src/models/template.ee.js';
import { createFlow } from './flow.js';
import { createStep } from './step.js';

export const createTemplate = async (params = {}) => {
  params.name = params?.name || 'Sample template name!';

  if (!params?.flowData) {
    const flow = await createFlow();

    const triggerStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Catch raw webhook',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${flow.id}/sync`,
    });

    await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      name: 'Text',
      parameters: {
        input: `hello {{step.${triggerStep.id}.query.sample}} world`,
        transform: 'capitalize',
      },
      position: 2,
    });

    params.flowData = await flow.export();
  }

  params.createdAt = params?.createdAt || new Date().toISOString();
  params.updatedAt = params?.updatedAt || new Date().toISOString();

  const template = await Template.query().insertAndFetch(params);

  return template;
};
