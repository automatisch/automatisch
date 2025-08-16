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

  // Get all repeatable jobs and trigger them immediately for testing
  const repeatableJobs = await flowQueue.getRepeatableJobs();

  for (const repeatableJob of repeatableJobs) {
    await flowQueue.add(
      'execute-flow',
      { flowId: repeatableJob.id },
      { delay: 0 }
    );
  }

  // Wait for jobs to be processed
  let jobCounts;

  do {
    await new Promise((resolve) => setTimeout(resolve, 100));
    jobCounts = await flowQueue.getJobCounts();
  } while (jobCounts.waiting > 0 || jobCounts.active > 0);
};

export const stopFlowWorker = async () => {
  await flowWorker.close();
};

export default runFlowWorkerJobs;
