import flowWorker from '@/workers/flow.js';
import flowQueue from '@/queues/flow.js';

export const startFlowWorker = async () => {
  await flowWorker.waitUntilReady();
};

export const waitFlowWorkerJobs = async (flowId) => {
  const jobs = await flowQueue.getJobs(['waiting', 'active']);

  const hasWaitingJob = jobs.some((job) => job.data.flowId === flowId);

  if (hasWaitingJob) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return waitFlowWorkerJobs(flowId);
  }

  return;
};

export const runFlowWorkerJobs = async (flowId) => {
  // Promote the delayed jobs
  const jobs = await flowQueue.getJobs(['delayed']);

  for (const job of jobs) {
    if (job.data.flowId === flowId) {
      await job.promote();
    }
  }

  await waitFlowWorkerJobs(flowId);
};

export const drainFlowWorkerJobs = async (delayed = false) => {
  return await flowQueue.drain(delayed);
};

export const stopFlowWorker = async () => {
  await flowWorker.close();
};

export default runFlowWorkerJobs;
