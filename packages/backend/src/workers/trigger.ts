import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import { IJSONObject, ITriggerItem } from '@automatisch/types';
import actionQueue from '../queues/action';
import Step from '../models/step';
import { processTrigger } from '../services/trigger';

type JobData = {
  flowId: string;
  stepId: string;
  triggerItem?: ITriggerItem;
  error?: IJSONObject;
};

export const worker = new Worker(
  'trigger',
  async (job) => {
    const { flowId, executionId, stepId, executionStep } = await processTrigger(
      job.data as JobData
    );

    if (executionStep.isFailed) return;

    const step = await Step.query().findById(stepId).throwIfNotFound();
    const nextStep = await step.getNextStep();
    const jobName = `${executionId}-${nextStep.id}`;

    const jobPayload = {
      flowId,
      executionId,
      stepId: nextStep.id,
    };

    await actionQueue.add(jobName, jobPayload);
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
