import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import Flow from '../models/flow';
import logger from '../helpers/logger';
import globalVariable from '../helpers/global-variable';
import { IGlobalVariable } from '@automatisch/types';
import Execution from '../models/execution';
import Processor from '../services/processor';
import ExecutionStep from '../models/execution-step';
import Step from '../models/step';
import actionQueue from '../queues/action';

type JobData = {
  flowId: string;
  executionId: string;
  stepId: string;
};

export const worker = new Worker(
  'action',
  async (job) => {
    const { flowId, stepId, executionId } = job.data as JobData;

    const step = await Step.query().findById(stepId).throwIfNotFound();
    const execution = await Execution.query()
      .findById(executionId)
      .throwIfNotFound();

    const $ = await globalVariable({
      flow: await Flow.query().findById(flowId).throwIfNotFound(),
      app: await step.getApp(),
      step: step,
      connection: await step.$relatedQuery('connection'),
      execution: execution,
    });

    const priorExecutionSteps = await ExecutionStep.query().where({
      execution_id: $.execution.id,
    });

    const computedParameters = Processor.computeParameters(
      $.step.parameters,
      priorExecutionSteps
    );

    const actionCommand = await step.getActionCommand();

    $.step.parameters = computedParameters;
    const actionDataItem = await actionCommand.run($);

    await execution.$relatedQuery('executionSteps').insertAndFetch({
      stepId: $.step.id,
      status: 'success',
      dataIn: computedParameters,
      dataOut: actionDataItem.data.raw,
    });

    // TODO: Add until step id logic here!
    // TODO: Change job name for the action data item!
    const jobName = `${$.step.appKey}-sample`;

    if (!$.nextStep.id) return;

    const nextStep = await Step.query()
      .findById($.nextStep.id)
      .throwIfNotFound();

    console.log('hello world');

    const variable = await globalVariable({
      flow: await Flow.query().findById($.flow.id),
      app: await nextStep.getApp(),
      step: nextStep,
      connection: await nextStep.$relatedQuery('connection'),
      execution: execution,
    });

    const jobPayload = {
      $: variable,
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
    `JOB ID: ${job.id} - FLOW ID: ${job.data.flowId} has failed22 to start with ${err.message}`
  );
});

process.on('SIGTERM', async () => {
  await worker.close();
});
