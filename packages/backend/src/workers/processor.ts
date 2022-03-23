import { Worker } from 'bullmq';
import Processor from '../services/processor';
import redisConfig from '../config/redis';
import Flow from '../models/flow';
import logger from '../helpers/logger';

const worker = new Worker(
  'processor',
  async (job) => {
    const flow = await Flow.query().findById(job.data.flowId).throwIfNotFound();
    const data = await new Processor(flow, { testRun: false }).run();

    return data;
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(`JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has completed!`);
});

worker.on('failed', (job, err) => {
  logger.info(
    `JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed with ${err.message}`
  );
});
