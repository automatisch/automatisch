import { Worker } from 'bullmq';
import process from 'node:process';

import * as Sentry from '../helpers/sentry.ee.js';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';
import appConfig from '../config/app.js';
import User from '../models/user.js';
import ExecutionStep from '../models/execution-step.js';

export const worker = new Worker(
  'delete-user',
  async (job) => {
    const { id } = job.data;

    const user = await User.query()
      .withSoftDeleted()
      .findById(id)
      .throwIfNotFound();

    const executionIds = (
      await user
        .$relatedQuery('executions')
        .withSoftDeleted()
        .select('executions.id')
    ).map((execution) => execution.id);

    await ExecutionStep.query()
      .withSoftDeleted()
      .whereIn('execution_id', executionIds)
      .hardDelete();
    await user.$relatedQuery('executions').withSoftDeleted().hardDelete();
    await user.$relatedQuery('steps').withSoftDeleted().hardDelete();
    await user.$relatedQuery('flows').withSoftDeleted().hardDelete();
    await user.$relatedQuery('connections').withSoftDeleted().hardDelete();
    await user.$relatedQuery('identities').withSoftDeleted().hardDelete();

    if (appConfig.isCloud) {
      await user.$relatedQuery('subscriptions').withSoftDeleted().hardDelete();
      await user.$relatedQuery('usageData').withSoftDeleted().hardDelete();
    }

    await user.$relatedQuery('accessTokens').withSoftDeleted().hardDelete();
    await user.$query().withSoftDeleted().hardDelete();
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(
    `JOB ID: ${job.id} - The user with the ID of '${job.data.id}' has been deleted!`
  );
});

worker.on('failed', (job, err) => {
  const errorMessage = `
    JOB ID: ${job.id} - The user with the ID of '${job.data.id}' has failed to be deleted! ${err.message}
    \n ${err.stack}
  `;

  logger.error(errorMessage);

  Sentry.captureException(err, {
    extra: {
      jobId: job.id,
    },
  });
});

process.on('SIGTERM', async () => {
  await worker.close();
});
