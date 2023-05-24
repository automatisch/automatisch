import Crypto from 'node:crypto';
import { Response } from 'express';
import { IRequest, ITriggerItem } from '@automatisch/types';

import logger from '../../helpers/logger';
import Flow from '../../models/flow';
import { processTrigger } from '../../services/trigger';
import actionQueue from '../../queues/action';
import globalVariable from '../../helpers/global-variable';
import QuotaExceededError from '../../errors/quote-exceeded';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../../helpers/remove-job-configuration';

export default async (request: IRequest, response: Response) => {
  const flowId = request.params.flowId;

  // in case it's our built-in generic webhook trigger
  let computedRequestPayload = {
    headers: request.headers,
    body: request.body,
    query: request.query,
  };
  logger.debug(`Handling incoming webhook request at ${request.originalUrl}.`);
  logger.debug(computedRequestPayload);

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
  const triggerCommand = await triggerStep.getTriggerCommand();
  const app = await triggerStep.getApp();
  const isWebhookApp = app.key === 'webhook';

  if (testRun && !isWebhookApp) {
    return response.sendStatus(404);
  }

  if (triggerCommand.type !== 'webhook') {
    return response.sendStatus(404);
  }

  if (app.auth?.verifyWebhook) {
    const $ = await globalVariable({
      flow,
      connection: await triggerStep.$relatedQuery('connection'),
      app,
      step: triggerStep,
      request,
    });

    const verified = await app.auth.verifyWebhook($);

    if (!verified) {
      return response.sendStatus(401);
    }
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
    return response.sendStatus(204);
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

  return response.sendStatus(204);
};
