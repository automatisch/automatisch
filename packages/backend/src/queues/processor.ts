import { Queue } from 'bullmq';
import redisConfig from '../config/redis';

const processorQueue = new Queue('processor', {
  connection: redisConfig,
});

export default processorQueue;
