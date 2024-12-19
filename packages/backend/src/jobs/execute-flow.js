import triggerQueue from '../queues/trigger.js';
import { processFlow } from '../services/flow.js';
import Flow from '../models/flow.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../helpers/remove-job-configuration.js';

export const executeFlowJob = async (job) => {
  const { flowId } = job.data;

  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const user = await flow.$relatedQuery('user');
  const allowedToRunFlows = await user.isAllowedToRunFlows();

  if (!allowedToRunFlows) {
    return;
  }

  const triggerStep = await flow.getTriggerStep();

  const { data, error } = await processFlow({ flowId });

  const reversedData = data.reverse();

  const jobOptions = {
    removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
    removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  };

  for (const triggerItem of reversedData) {
    const jobName = `${triggerStep.id}-${triggerItem.meta.internalId}`;

    const jobPayload = {
      flowId,
      stepId: triggerStep.id,
      triggerItem,
    };

    await triggerQueue.add(jobName, jobPayload, jobOptions);
  }

  if (error) {
    const jobName = `${triggerStep.id}-error`;

    const jobPayload = {
      flowId,
      stepId: triggerStep.id,
      error,
    };

    await triggerQueue.add(jobName, jobPayload, jobOptions);
  }
};
