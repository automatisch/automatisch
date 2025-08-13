import Flow from '@/models/flow.js';

export const verifyWebhookRequest = async (request, response, next) => {
  const { flowId } = request.params;

  const flow = await Flow.query().findById(flowId).throwIfNotFound();

  const triggerStep = await flow.getTriggerStep();
  const app = await triggerStep.getApp();
  const isWebhookApp = app.key === 'webhook';
  const isFormsApp = app.key === 'forms';

  if (!isWebhookApp && !isFormsApp) {
    const connection = await triggerStep.$relatedQuery('connection');

    if (!(await connection.verifyWebhook(request))) {
      return response.status(401).end();
    }
  }

  next();
};
