import { Worker } from 'bullmq';

import * as Sentry from '../helpers/sentry.ee';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import User from '../models/user';
import Execution from '../models/execution';
import ExecutionStep from '../models/execution-step';

export const worker = new Worker(
  'delete-user',
  async (job) => {
    const { id } = job.data;

    const user = await User.query().findById(id).throwIfNotFound();

    const executionIds = (
      await user.$relatedQuery('executions').select('executions.id')
    ).map((execution: Execution) => execution.id);

    await ExecutionStep.query().hardDelete().whereIn('execution_id', executionIds);
    await user.$relatedQuery('executions').hardDelete();
    await user.$relatedQuery('steps').hardDelete();
    await user.$relatedQuery('flows').hardDelete();
    await user.$relatedQuery('connections').hardDelete();

    await user.$query().hardDelete();
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(
    `JOB ID: ${job.id} - The user with the ID of '${job.data.id}' has been deleted!`
  );
});

worker.on('failed', (job, err) => {
  logger.info(
    `JOB ID: ${job.id} - The user with the ID of '${job.data.id}' has failed to be deleted! ${err.message}`
  );

  Sentry.captureException(err, {
    extra: {
      jobId: job.id,
    }
  });
});

process.on('SIGTERM', async () => {
  await worker.close();
});
