import { Queue, QueueScheduler } from 'bullmq';
import redisConfig from '../config/redis';

const redisConnection = {
  connection: redisConfig,
};

new QueueScheduler('processor', redisConnection);
const processorQueue = new Queue('processor', redisConnection);

export default processorQueue;
