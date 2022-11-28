import { Request, Response } from 'express';

import { ITriggerItem } from '@automatisch/types';
import Flow from '../../models/flow';
import triggerQueue from '../../queues/trigger';
import globalVariable from '../../helpers/global-variable';

export default async (request: Request, response: Response) => {
  const flow = await Flow.query()
    .findById(request.params.flowId)
    .throwIfNotFound();

  if (!flow.active) {
    return response.send(404);
  }

  const triggerStep = await flow.getTriggerStep();
  const app = await triggerStep.getApp();

  if (app.auth.verifyWebhook) {
    const $ = await globalVariable({
      flow,
      connection: await triggerStep.$relatedQuery('connection'),
      app,
      step: triggerStep,
      testRun: false,
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
      internalId: request.body.form_response.token,
    },
  };

  const jobName = `${triggerStep.id}-${triggerItem.meta.internalId}`;

  const jobPayload = {
    flowId: flow.id,
    stepId: triggerStep.id,
    triggerItem,
  };

  await triggerQueue.add(jobName, jobPayload);

  return response.sendStatus(200);
};
