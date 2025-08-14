import Engine from '@/engine/index.js';

export const executeFlowJob = async (job) => {
  const { flowId, resumeStepId, resumeExecutionId } = job.data;

  await Engine.run({
    flowId,
    resumeStepId,
    resumeExecutionId,
  });
};
