import Flow from '@/models/flow.js';
import logger from '@/helpers/logger.js';
import Engine from '@/engine/index.js';

export default async (request, response) => {
  const computedRequestPayload = {
    headers: request.headers,
    body: request.body,
    query: request.query,
    params: request.params,
  };

  logger.debug(`Handling incoming webhook request at ${request.originalUrl}.`);
  logger.debug(JSON.stringify(computedRequestPayload, null, 2));

  const flowId = request.params.flowId;
  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const testRun = !flow.active;

  const { statusCode, body, headers } = await Engine.run({
    flowId,
    request,
    triggeredByRequest: true,
    testRun,
  });

  response.set(headers).status(statusCode).send(body);
};
