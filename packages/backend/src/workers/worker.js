import { Worker } from 'bullmq';

import * as Sentry from '../helpers/sentry.ee.js';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';

export const generateWorker = (workerName, job) => {
  const worker = new Worker(workerName, job, { connection: redisConfig });

  worker.on('completed', (job) => {
    logger.info(`JOB ID: ${job.id} - has been successfully completed!`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`
      JOB ID: ${job.id} - has failed to be completed! ${err.message}
      \n ${err.stack}
    `);

    Sentry.captureException(err, {
      extra: {
        jobId: job.id,
      },
    });
  });

  return worker;
};
