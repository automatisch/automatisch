import isEmpty from 'lodash/isEmpty.js';

import Flow from '../models/flow.js';
import { processTrigger } from '../services/trigger.js';
import { processAction } from '../services/action.js';
import globalVariable from './global-variable.js';
import QuotaExceededError from '../errors/quote-exceeded.js';

export default async (flowId, request, response) => {
  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const user = await flow.$relatedQuery('user');

  const testRun = !flow.active;
  const quotaExceeded = !testRun && !(await user.isAllowedToRunFlows());

  if (quotaExceeded) {
    throw new QuotaExceededError();
  }

  const [triggerStep, ...actionSteps] = await flow
    .$relatedQuery('steps')
    .withGraphFetched('connection')
    .orderBy('position', 'asc');
  const app = await triggerStep.getApp();
  const isWebhookApp = app.key === 'webhook';

  if (testRun && !isWebhookApp) {
    return response.status(404);
  }

  const connection = await triggerStep.$relatedQuery('connection');

  const $ = await globalVariable({
    flow,
    connection,
    app,
    step: triggerStep,
    testRun,
    request,
  });

  const triggerCommand = await triggerStep.getTriggerCommand();
  await triggerCommand.run($);

  const reversedTriggerItems = $.triggerOutput.data.reverse();

  // This is the case when we filter out the incoming data
  // in the run method of the webhook trigger.
  // In this case, we don't want to process anything.
  if (isEmpty(reversedTriggerItems)) {
    return response.status(204);
  }

  // set default status, but do not send it yet!
  response.status(204);

  for (const triggerItem of reversedTriggerItems) {
    const { executionId } = await processTrigger({
      flowId,
      stepId: triggerStep.id,
      triggerItem,
      testRun,
    });

    if (testRun) {
      response.status(204).end();

      // in case of testing, we do not process the whole process.
      continue;
    }

    for (const actionStep of actionSteps) {
      const { executionStep: actionExecutionStep } = await processAction({
        flowId: flow.id,
        stepId: actionStep.id,
        executionId,
      });

      if (actionStep.appKey === 'filter' && !actionExecutionStep.dataOut) {
        response.status(422).end();

        break;
      }

      if (actionStep.key === 'respondWith' && !response.headersSent) {
        const { headers, statusCode, body } = actionExecutionStep.dataOut;

        // we set the custom response headers
        if (headers) {
          for (const [key, value] of Object.entries(headers)) {
            if (key) {
              response.set(key, value);
            }
          }
        }

        // we send the response only if it's not sent yet. This allows us to early respond from the flow.
        response.status(statusCode);
        response.send(body);
      }
    }
  }

  return response;
};
