import { Response } from 'express';
import bcrypt from 'bcrypt';
import { IRequest, ITriggerItem } from '@automatisch/types';

import Flow from '../../models/flow';
import { processTrigger } from '../../services/trigger';
import actionQueue from '../../queues/action';
import globalVariable from '../../helpers/global-variable';
import { REMOVE_AFTER_30_DAYS_OR_150_JOBS, REMOVE_AFTER_7_DAYS_OR_50_JOBS } from '../../helpers/remove-job-configuration';

export default async (request: IRequest, response: Response) => {
  const flow = await Flow.query()
    .findById(request.params.flowId)
    .throwIfNotFound();

  if (!flow.active) {
    return response.send(404);
  }

  const triggerStep = await flow.getTriggerStep();
  const triggerCommand = await triggerStep.getTriggerCommand();

  if (triggerCommand.type !== 'webhook') {
    return response.send(404);
  }

  const app = await triggerStep.getApp();

  if (app.auth.verifyWebhook) {
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

  const triggerItem: ITriggerItem = {
    raw: request.body,
    meta: {
      internalId: await bcrypt.hash(request.rawBody, 1),
    },
  };

  const { flowId, executionId } = await processTrigger({
    flowId: flow.id,
    stepId: triggerStep.id,
    triggerItem,
  });

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
  }

  await actionQueue.add(jobName, jobPayload, jobOptions);

  return response.sendStatus(200);
};
