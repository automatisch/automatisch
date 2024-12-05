import { Worker } from 'bullmq';

import * as Sentry from '../helpers/sentry.ee.js';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';
import actionQueue from '../queues/action.js';
import Step from '../models/step.js';
import { processTrigger } from '../services/trigger.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../helpers/remove-job-configuration.js';

const triggerWorker = new Worker(
  'trigger',
  async (job) => {
    const { flowId, executionId, stepId, executionStep } = await processTrigger(
      job.data
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

    const jobOptions = {
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    };

    await actionQueue.add(jobName, jobPayload, jobOptions);
  },
  { connection: redisConfig }
);

triggerWorker.on('completed', (job) => {
  logger.info(`JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has started!`);
});

triggerWorker.on('failed', (job, err) => {
  const errorMessage = `
    JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed to start with ${err.message}
    \n ${err.stack}
  `;

  logger.error(errorMessage);

  Sentry.captureException(err, {
    extra: {
      jobId: job.id,
    },
  });
});

export default triggerWorker;
