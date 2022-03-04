import { Worker } from 'bullmq';
import Processor from '../services/processor';
import redisConfig from '../config/redis';
import Step from '../models/step';
import logger from '../helpers/logger';

const worker = new Worker(
  'processor',
  async (job) => {
    const step = await Step.query()
      .withGraphFetched('connection')
      .findOne({
        'steps.id': job.data.stepId,
      })
      .throwIfNotFound();

    const flow = await step.$relatedQuery('flow');

    const data = await new Processor(flow, step).run();
    return data;
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  logger.info(`${job.id} has failed with ${err.message}`);
});
