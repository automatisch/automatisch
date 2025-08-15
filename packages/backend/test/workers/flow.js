import flowWorker from '@/workers/flow.js';
import flowQueue from '@/queues/flow.js';

export const startFlowWorker = async () => {
  await flowWorker.waitUntilReady();
};

export const runFlowWorkerJobs = async () => {
  // Promote the delayed jobs
  const jobs = await flowQueue.getJobs(['delayed']);

  for (const job of jobs) {
    await job.promote();
  }

  // Wait for jobs to be processed
  let jobCounts;

  do {
    await new Promise((resolve) => setTimeout(resolve, 100));
    jobCounts = await flowQueue.getJobCounts();
  } while (jobCounts.waiting > 0 || jobCounts.active > 0);
};

export const closeFlowWorker = async () => {
  await flowWorker.close();
};

export default runFlowWorkerJobs;
