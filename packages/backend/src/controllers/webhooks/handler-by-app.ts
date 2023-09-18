import { Response } from 'express';
import { IRequest } from '@automatisch/types';

import Step from '../../models/step';
import logger from '../../helpers/logger';
import handler from '../../helpers/webhook-handler';

export default async (request: IRequest, response: Response) => {
  const computedRequestPayload = {
    headers: request.headers,
    body: request.body,
    query: request.query,
    params: request.params,
  };
  logger.debug(`Handling incoming webhook request at ${request.originalUrl}.`);
  logger.debug(JSON.stringify(computedRequestPayload, null, 2));

  const triggerSteps = await Step.query().where({
    type: 'trigger',
    app_key: 'vonage',
    key: 'receiveMessage',
  });

  if (triggerSteps.length === 0) return response.sendStatus(404);

  for (const triggerStep of triggerSteps) {
    const flow = await triggerStep.$relatedQuery('flow');
    if (flow.status !== 'published') continue;

    await handler(triggerStep.flowId, request, response);
  }

  response.sendStatus(204);
};
