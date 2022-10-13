import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import Flow from '../models/flow';
import logger from '../helpers/logger';
import globalVariable from '../helpers/global-variable';
import { ITriggerDataItem, IGlobalVariable } from '@automatisch/types';
import Execution from '../models/execution';
import actionQueue from '../queues/action';
import Step from '../models/step';

type JobData = {
  $: IGlobalVariable;
  triggerDataItem: ITriggerDataItem;
};

export const worker = new Worker(
  'trigger',
  async (job) => {
    const { $, triggerDataItem } = job.data as JobData;

    // check if we already process this trigger data item or not!

    const execution = await Execution.query().insert({
      flowId: $.flow.id,
      // TODO: Check the testRun logic and adjust following line!
      testRun: true,
      internalId: triggerDataItem.meta.internalId,
    });

    await execution.$relatedQuery('executionSteps').insertAndFetch({
      stepId: $.step.id,
      status: 'success',
      dataIn: $.step.parameters,
      dataOut: triggerDataItem.raw,
    });

    const jobName = `${$.step.appKey}-${triggerDataItem.meta.internalId}`;

    const nextStep = await Step.query().findById($.nextStep.id);

    const jobPayload = {
      flowId: $.flow.id,
      executionId: execution.id,
      stepId: nextStep.id,
    };

    await actionQueue.add(jobName, jobPayload);
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
