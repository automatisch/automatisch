import { runExecutor } from '@/executor/index.js';

export default async (request, response) => {
  return await runExecutor({
    flowId: request.params.flowId,
    request,
    response,
    asyncWebhook: true,
    syncWebhook: false,
    triggeredByRequest: true,
  });
};
