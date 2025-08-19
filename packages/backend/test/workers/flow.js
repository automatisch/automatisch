import flowWorker from '@/workers/flow.js';
import flowQueue from '@/queues/flow.js';

export const startFlowWorker = async () => {
  await flowWorker.waitUntilReady();
};

export const waitFlowWorkerJobs = async () => {
  // Wait for jobs to be processed
  let jobCounts;

  do {
    await new Promise((resolve) => setTimeout(resolve, 100));
    jobCounts = await flowQueue.getJobCounts();
  } while (jobCounts.waiting > 0 || jobCounts.active > 0);
};

export const runFlowWorkerJobs = async (flowId) => {
  // Promote the delayed jobs
  const jobs = await flowQueue.getJobs(['delayed']);

  for (const job of jobs) {
    if (job.data.flowId === flowId) {
      await job.promote();
    }
  }

  await waitFlowWorkerJobs();
};

export const stopFlowWorker = async () => {
  await flowWorker.close();
};

export default runFlowWorkerJobs;
