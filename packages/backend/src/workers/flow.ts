import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import triggerQueue from '../queues/trigger';
import { processFlow } from '../services/flow';
import Flow from '../models/flow';
import { REMOVE_AFTER_30_DAYS_OR_150_JOBS, REMOVE_AFTER_7_DAYS_OR_50_JOBS } from '../helpers/remove-job-configuration';

export const worker = new Worker(
  'flow',
  async (job) => {
    const { flowId } = job.data;

    const flow = await Flow.query().findById(flowId).throwIfNotFound();

    const quotaExceeded = await flow.checkIfQuotaExceeded();

    if (quotaExceeded) {
      return;
    }

    const triggerStep = await flow.getTriggerStep();

    const { data, error } = await processFlow({ flowId });

    const reversedData = data.reverse();

    const jobOptions = {
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    }

    for (const triggerItem of reversedData) {
      const jobName = `${triggerStep.id}-${triggerItem.meta.internalId}`;

      const jobPayload = {
        flowId,
        stepId: triggerStep.id,
        triggerItem,
      };

      await triggerQueue.add(jobName, jobPayload, jobOptions);
    }

    if (error) {
      const jobName = `${triggerStep.id}-error`;

      const jobPayload = {
        flowId,
        stepId: triggerStep.id,
        error,
      };

      await triggerQueue.add(jobName, jobPayload, jobOptions);
    }
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(`JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has started!`);
});

worker.on('failed', (job, err) => {
  logger.info(
    `JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed to start with ${err.message}`
  );
});

process.on('SIGTERM', async () => {
  await worker.close();
});
