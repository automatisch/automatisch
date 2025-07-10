import runExecutor from '@/executor/index.js';

export const executeFlowJob = async (job) => {
  await runExecutor({ flowId: job.data.flowId, testRun: false });
};
