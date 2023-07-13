import path from 'node:path';
import { Response } from 'express';
import { IRequest } from '@automatisch/types';

import Connection from '../../models/connection';
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

  const { connectionId } = request.params;

  const connection = await Connection.query()
    .findById(connectionId)
    .throwIfNotFound();

  if (!await connection.verifyWebhook(request)) {
    return response.sendStatus(401);
  }

  const triggerSteps = await connection
    .$relatedQuery('triggerSteps')
    .where('webhook_path', path.join(request.baseUrl, request.path));

  if (triggerSteps.length === 0) return response.sendStatus(404);

  for (const triggerStep of triggerSteps) {
    await handler(triggerStep.flowId, request, response);
  }

  response.sendStatus(204);
};
