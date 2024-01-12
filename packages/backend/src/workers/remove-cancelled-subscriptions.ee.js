import { Worker } from 'bullmq';
import process from 'node:process';
import { DateTime } from 'luxon';
import * as Sentry from '../helpers/sentry.ee.js';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';
import Subscription from '../models/subscription.ee.js';

export const worker = new Worker(
  'remove-cancelled-subscriptions',
  async () => {
    await Subscription.query()
      .delete()
      .where({
        status: 'deleted',
      })
      .andWhere(
        'cancellation_effective_date',
        '<=',
        DateTime.now().startOf('day').toISODate()
      );
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(
    `JOB ID: ${job.id} - The cancelled subscriptions have been removed!`
  );
});

worker.on('failed', (job, err) => {
  const errorMessage = `
    JOB ID: ${job.id} - ERROR: The cancelled subscriptions can not be removed! ${err.message}
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
