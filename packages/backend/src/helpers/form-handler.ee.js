import isEmpty from 'lodash/isEmpty.js';

import Flow from '../models/flow.js';
import { processTrigger } from '../services/trigger.js';
import triggerQueue from '../queues/trigger.js';
import globalVariable from './global-variable.js';
import QuotaExceededError from '../errors/quote-exceeded.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from './remove-job-configuration.js';

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

  const $ = await globalVariable({
    flow,
    app,
    step: triggerStep,
    testRun,
    request,
  });

  const triggerCommand = await triggerStep.getTriggerCommand();
  await triggerCommand.run($);

  const triggerItem = $.triggerOutput.data?.[0];

  if (isEmpty(triggerItem)) {
    return response.status(204);
  }

  if (testRun) {
    await processTrigger({
      flowId,
      stepId: triggerStep.id,
      triggerItem,
      testRun,
    });

    return response.status(204);
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

  return response.status(204);
};
