import { runExecutor } from '@/executor/index.js';

export default async (request, response) => {
  return await runExecutor({
    flowId: request.params.flowId,
    request,
    response,
    asyncWebhook: false,
    syncWebhook: true,
    triggeredByRequest: true,
  });
};
