import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import triggerQueue from '../queues/trigger';
import { processFlow } from '../services/flow';
import Flow from '../models/flow';

export const worker = new Worker(
  'flow',
  async (job) => {
    const { flowId } = job.data;

    const flow = await Flow.query().findById(flowId).throwIfNotFound();
    const triggerStep = await flow.getTriggerStep();

    const { data, error } = await processFlow({ flowId });

    for (const triggerDataItem of data) {
      const jobName = `${triggerStep.id}-${triggerDataItem.meta.internalId}`;

      const jobPayload = {
        flowId,
        stepId: triggerStep.id,
        triggerDataItem,
      };

      await triggerQueue.add(jobName, jobPayload);
    }

    if (error) {
      const jobName = `${triggerStep.id}-error`;

      const jobPayload = {
        flowId,
        stepId: triggerStep.id,
        error,
      };

      await triggerQueue.add(jobName, jobPayload);
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
