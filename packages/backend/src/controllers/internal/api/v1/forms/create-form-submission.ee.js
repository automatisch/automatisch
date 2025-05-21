import Flow from '../../../../../models/flow.js';
import logger from '../../../../../helpers/logger.js';
import handler from '../../../../../helpers/form-handler.ee.js';
import { renderError } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  logger.debug(`Handling incoming form submission at ${request.originalUrl}.`);
  logger.debug(JSON.stringify(request.body, null, 2));

  const formId = request.params.formId;
  const flow = await Flow.query().findById(formId).throwIfNotFound();
  const triggerStep = await flow.getTriggerStep();

  if (triggerStep.appKey !== 'forms') {
    return renderError(response, [{ general: ['Invalid trigger step'] }], 400);
  }

  await handler(formId, request, response);

  response.sendStatus(204);
};
