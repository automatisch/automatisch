import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import Step from '../models/step';
import actionQueue from '../queues/action';
import { processAction } from '../services/action';

type JobData = {
  flowId: string;
  executionId: string;
  stepId: string;
};

export const worker = new Worker(
  'action',
  async (job) => {
    const { stepId, flowId, executionId } = await processAction(
      job.data as JobData
    );

    const step = await Step.query().findById(stepId).throwIfNotFound();
    const nextStep = await step.getNextStep();

    if (!nextStep) return;

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
    `JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed22 to start with ${err.message}`
  );
});

process.on('SIGTERM', async () => {
  await worker.close();
});
