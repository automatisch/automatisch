import process from 'process';
import { Queue } from 'bullmq';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';

const CONNECTION_REFUSED = 'ECONNREFUSED';

const redisConnection = {
  connection: redisConfig,
};

const removeCancelledSubscriptionsQueue = new Queue(
  'remove-cancelled-subscriptions',
  redisConnection
);

process.on('SIGTERM', async () => {
  await removeCancelledSubscriptionsQueue.close();
});

removeCancelledSubscriptionsQueue.on('error', (error) => {
  if (error.code === CONNECTION_REFUSED) {
    logger.error(
      'Make sure you have installed Redis and it is running.',
      error
    );

    process.exit();
  }

  logger.error(
    'Error happened in remove cancelled subscriptions queue!',
    error
  );
});

removeCancelledSubscriptionsQueue.add('remove-cancelled-subscriptions', null, {
  jobId: 'remove-cancelled-subscriptions',
  repeat: {
    pattern: '0 1 * * *',
  },
});

export default removeCancelledSubscriptionsQueue;
