import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import Flow from '../models/flow';
import logger from '../helpers/logger';
import globalVariable from '../helpers/global-variable';

export const worker = new Worker(
  'flow',
  async (job) => {
    const flow = await Flow.query().findById(job.data.flowId).throwIfNotFound();

    const triggerStep = await flow.getTriggerStep();
    const triggerCommand = await triggerStep.getTriggerCommand();

    const $ = await globalVariable({
      flow,
      connection: await triggerStep.$relatedQuery('connection'),
      app: await triggerStep.getApp(),
      step: triggerStep,
    });

    await triggerCommand.run($);
  },
  { connection: redisConfig }
);

worker.on('completed', (job) => {
  logger.info(`JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has started!`);
});

worker.on('failed', (job, err) => {
  logger.info(
    `JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed to start with ${err.message}`
  );
});

process.on('SIGTERM', async () => {
  await worker.close();
});
