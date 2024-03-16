import process from 'process';
import { Queue } from 'bullmq';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';

const CONNECTION_REFUSED = 'ECONNREFUSED';

const redisConnection = {
  connection: redisConfig,
};

const triggerQueue = new Queue('trigger', redisConnection);

process.on('SIGTERM', async () => {
  await triggerQueue.close();
});

triggerQueue.on('error', (error) => {
  if (error.code === CONNECTION_REFUSED) {
    logger.error(
      'Make sure you have installed Redis and it is running.',
      error
    );

    process.exit();
  }

  logger.error('Error happened in trigger queue!', error);
});

export default triggerQueue;
