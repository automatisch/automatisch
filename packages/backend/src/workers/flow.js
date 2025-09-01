import { generateWorker } from '@/workers/worker.js';
import Engine from '@/engine/index.js';

const flowWorker = generateWorker('flow', async (job) => {
  const {
    flowId,
    resumeStepId,
    resumeExecutionId,
    request,
    testRun,
    triggeredByRequest,
  } = job.data;

  await Engine.run({
    flowId,
    request,
    resumeStepId,
    resumeExecutionId,
    testRun,
    triggeredByRequest,
  });
});

export default flowWorker;
