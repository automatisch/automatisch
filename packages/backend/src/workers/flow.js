import { generateWorker } from '@/workers/worker.js';
import Engine from '@/engine/index.js';

const flowWorker = generateWorker('flow', async (job) => {
  const { flowId, resumeStepId, resumeExecutionId, request } = job.data;

  await Engine.run({
    flowId,
    request,
    resumeStepId,
    resumeExecutionId,
  });
});

export default flowWorker;
