import { generateWorker } from '@/workers/worker.js';
import Engine from '@/engine/index.js';

const flowWorker = generateWorker('flow', async (job) => {
  const { flowId, resumeStepId, resumeExecutionId } = job.data;

  await Engine.run({
    flowId,
    resumeStepId,
    resumeExecutionId,
  });
});

export default flowWorker;
