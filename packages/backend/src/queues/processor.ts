import process from 'process';
import { Queue, QueueScheduler } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';

const CONNECTION_REFUSED = 'ECONNREFUSED';

const redisConnection = {
  connection: redisConfig,
};

const processorQueue = new Queue('processor', redisConnection);
const queueScheduler = new QueueScheduler('processor', redisConnection);

process.on('SIGTERM', async () => {
  await queueScheduler.close();
});

processorQueue.on('error', (err) => {
  if ((err as any).code === CONNECTION_REFUSED) {
    logger.error('Make sure you have installed Redis and it is running.', err);
    process.exit();
  }
});

export default processorQueue;
