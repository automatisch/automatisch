import isEmpty from 'lodash/isEmpty.js';

import Flow from '@/models/flow.js';
import { processTrigger } from '@/executor/index.js';
import triggerQueue from '@/queues/trigger.js';
import globalVariable from '@/helpers/global-variable.js';
import QuotaExceededError from '@/errors/quote-exceeded.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '@/helpers/remove-job-configuration.js';

export default async (flowId, request, response) => {
  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const user = await flow.$relatedQuery('user');

  const testRun = !flow.active;
  const quotaExceeded = !testRun && !(await user.isAllowedToRunFlows());

  if (quotaExceeded) {
    throw new QuotaExceededError();
  }

  const triggerStep = await flow.getTriggerStep();
  const app = await triggerStep.getApp();
  const isWebhookApp = app.key === 'webhook';
  const isFormsApp = app.key === 'forms';

  if (testRun && !isWebhookApp && !isFormsApp) {
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

  for (const triggerItem of reversedTriggerItems) {
    if (testRun) {
      await processTrigger({
        flowId,
        stepId: triggerStep.id,
        triggerItem,
        testRun,
      });

      continue;
    }

    const jobName = `${triggerStep.id}-${triggerItem.meta.internalId}`;

    const jobOptions = {
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    };

    const jobPayload = {
      flowId,
      stepId: triggerStep.id,
      triggerItem,
    };

    await triggerQueue.add(jobName, jobPayload, jobOptions);
  }

  return response.status(204);
};
