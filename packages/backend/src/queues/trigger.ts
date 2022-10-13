import process from 'process';
import { Queue } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';

const CONNECTION_REFUSED = 'ECONNREFUSED';

const redisConnection = {
  connection: redisConfig,
};

const triggerQueue = new Queue('trigger', redisConnection);

process.on('SIGTERM', async () => {
  await triggerQueue.close();
});

triggerQueue.on('error', (err) => {
  if ((err as any).code === CONNECTION_REFUSED) {
    logger.error('Make sure you have installed Redis and it is running.', err);
    process.exit();
  }
});

export default triggerQueue;
