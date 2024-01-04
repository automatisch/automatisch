import process from 'process';
import { Queue } from 'bullmq';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';

const CONNECTION_REFUSED = 'ECONNREFUSED';

const redisConnection = {
  connection: redisConfig,
};

const flowQueue = new Queue('flow', redisConnection);

process.on('SIGTERM', async () => {
  await flowQueue.close();
});

flowQueue.on('error', (err) => {
  if (err.code === CONNECTION_REFUSED) {
    logger.error('Make sure you have installed Redis and it is running.', err);
    process.exit();
  }
});

export default flowQueue;
