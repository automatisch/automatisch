import Step from '../models/step.js';
import actionQueue from '../queues/action.js';
import { processAction } from '../services/action.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../helpers/remove-job-configuration.js';
import delayAsMilliseconds from '../helpers/delay-as-milliseconds.js';

const DEFAULT_DELAY_DURATION = 0;

export const executeActionJob = async (job) => {
  const { stepId, flowId, executionId, computedParameters, executionStep } =
    await processAction(job.data);

  if (executionStep.isFailed) return;

  const step = await Step.query().findById(stepId).throwIfNotFound();
  const nextStep = await step.getNextStep();

  if (!nextStep) return;

  const jobName = `${executionId}-${nextStep.id}`;

  const jobPayload = {
    flowId,
    executionId,
    stepId: nextStep.id,
  };

  const jobOptions = {
    removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
    removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    delay: DEFAULT_DELAY_DURATION,
  };

  if (step.appKey === 'delay') {
    jobOptions.delay = delayAsMilliseconds(step.key, computedParameters);
  }

  if (step.appKey === 'filter' && !executionStep.dataOut) {
    return;
  }

  await actionQueue.add(jobName, jobPayload, jobOptions);
};
