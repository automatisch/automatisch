import actionQueue from '../queues/action.js';
import Step from '../models/step.js';
import { processTrigger } from '../services/trigger.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../helpers/remove-job-configuration.js';

export const executeTriggerJob = async (job) => {
  const { flowId, executionId, stepId, executionStep } = await processTrigger(
    job.data
  );

  if (executionStep.isFailed) return;

  const step = await Step.query().findById(stepId).throwIfNotFound();
  const nextStep = await step.getNextStep();
  const jobName = `${executionId}-${nextStep.id}`;

  const jobPayload = {
    flowId,
    executionId,
    stepId: nextStep.id,
  };

  const jobOptions = {
    removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
    removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  };

  await actionQueue.add(jobName, jobPayload, jobOptions);
};
