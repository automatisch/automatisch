import Engine from '@/engine/index.js';

export const executeFlowJob = async (job) => {
  const { flowId } = job.data;

  await Engine.runInBackground({
    flowId,
  });
};
