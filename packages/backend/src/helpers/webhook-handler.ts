import Crypto from 'node:crypto';
import { Response } from 'express';
import { IRequest, ITriggerItem } from '@automatisch/types';

import Flow from '../models/flow';
import { processTrigger } from '../services/trigger';
import actionQueue from '../queues/action';
import globalVariable from './global-variable';
import QuotaExceededError from '../errors/quote-exceeded';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from './remove-job-configuration';

export default async (flowId: string, request: IRequest, response: Response) => {
  // in case it's our built-in generic webhook trigger
  let computedRequestPayload = {
    headers: request.headers,
    body: request.body,
    query: request.query,
  };

  const flow = await Flow.query()
    .findById(flowId)
    .throwIfNotFound();

  const user = await flow.$relatedQuery('user');

  const testRun = !flow.active;
  const quotaExceeded = !testRun && !(await user.isAllowedToRunFlows());

  if (quotaExceeded) {
    throw new QuotaExceededError();
  }

  const triggerStep = await flow.getTriggerStep();
  const app = await triggerStep.getApp();
  const isWebhookApp = app.key === 'webhook';

  if ((testRun && !isWebhookApp)) {
    return response.status(404);
  }

  // in case trigger type is 'webhook'
  if (!isWebhookApp) {
    computedRequestPayload = request.body;
  }

  const triggerItem: ITriggerItem = {
    raw: computedRequestPayload,
    meta: {
      internalId: Crypto.randomUUID(),
    },
  };

  const { executionId } = await processTrigger({
    flowId,
    stepId: triggerStep.id,
    triggerItem,
    testRun,
  });

  if (testRun) {
    return response.status(204);
  }

  const nextStep = await triggerStep.getNextStep();
  const jobName = `${executionId}-${nextStep.id}`;

  const jobPayload = {
    flowId,
    executionId,
    stepId: nextStep.id,
  };

  const jobOptions = {
    removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
    removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  };

  await actionQueue.add(jobName, jobPayload, jobOptions);

  return response.status(204);
};
