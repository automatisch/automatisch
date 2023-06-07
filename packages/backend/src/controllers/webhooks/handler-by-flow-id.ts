import path from 'node:path';
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

  const flowId = request.params.flowId;
  const triggerStep = await Step.query()
    .findOne({
      webhook_path: path.join(request.baseUrl, request.path),
    })
    .throwIfNotFound();
  const connection = await triggerStep.$relatedQuery('connection');

  if (!await connection.verifyWebhook(request)) {
    return response.sendStatus(401);
  }

  await handler(flowId, request, response);

  response.sendStatus(204);
};
