import Flow from '../../../../models/flow.js';
import logger from '../../../../helpers/logger.js';
import handler from '../../../../helpers/form-handler.ee.js';

export default async (request, response) => {
  logger.debug(`Handling incoming form submission at ${request.originalUrl}.`);
  logger.debug(JSON.stringify(request.body, null, 2));

  const formId = request.params.formId;
  const flow = await Flow.query().findById(formId).throwIfNotFound();
  const triggerStep = await flow.getTriggerStep();

  if (triggerStep.appKey !== 'forms') {
    logger.error('Invalid trigger step');
    return response.status(400).send('Invalid trigger step');
  }

  await handler(formId, request, response);

  response.sendStatus(204);
};
