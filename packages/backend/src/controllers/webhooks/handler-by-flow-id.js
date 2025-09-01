import Flow from '@/models/flow.js';
import Engine from '@/engine/index.js';
import logger from '@/helpers/logger.js';

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

  await Engine.runInBackground({
    flowId,
    request: {
      body: request.body,
      headers: request.headers,
      query: request.query,
    },
    triggeredByRequest: true,
    testRun,
  });

  return response.status(204).end();
};
