import { runExecutor } from '@/executor/index.js';

export default async (flowId, request, response) => {
  return await runExecutor({
    flowId,
    request,
    response,
    asyncWebhook: true,
    syncWebhook: false,
    triggeredByRequest: true,
    triggeredByTestAndContinue: false,
  });
};
