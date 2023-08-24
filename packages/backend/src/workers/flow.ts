import { Worker } from 'bullmq';

import * as Sentry from '../helpers/sentry.ee';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import flowQueue from '../queues/flow';
import triggerQueue from '../queues/trigger';
import { processFlow } from '../services/flow';
import Flow from '../models/flow';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../helpers/remove-job-configuration';

export const worker = new Worker(
  'flow',
  async (job) => {
    const { flowId } = job.data;

    const flow = await Flow.query().findById(flowId).throwIfNotFound();
    const user = await flow.$relatedQuery('user');
    const allowedToRunFlows = await user.isAllowedToRunFlows();

    if (!allowedToRunFlows) {
      return;
    }

    const triggerStep = await flow.getTriggerStep();

    const { data, error } = await processFlow({ flowId });

    const reversedData = data.reverse();

    const jobOptions = {
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    };

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

worker.on('failed', async (job, err) => {
  const errorMessage = `
    JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed to start with ${err.message}
    \n ${err.stack}
  `;

  logger.error(errorMessage);

  const flow = await Flow.query().findById(job.data.flowId);

  if (!flow) {
    await flowQueue.removeRepeatableByKey(job.repeatJobKey);

    const flowNotFoundErrorMessage = `
      JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has been deleted from Redis because flow was not found!
    `;

    logger.error(flowNotFoundErrorMessage);
  }

  Sentry.captureException(err, {
    extra: {
      jobId: job.id,
    },
  });
});

process.on('SIGTERM', async () => {
  await worker.close();
});
