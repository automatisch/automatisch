import Flow from '../../models/flow.js';
import flowQueue from '../../queues/flow.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../../helpers/remove-job-configuration.js';
import globalVariable from '../../helpers/global-variable.js';

const JOB_NAME = 'flow';
const EVERY_15_MINUTES_CRON = '*/15 * * * *';

const updateFlowStatus = async (_parent, params, context) => {
  const conditions = context.currentUser.can('publish', 'Flow');
  const isCreator = conditions.isCreator;
  const allFlows = Flow.query();
  const userFlows = context.currentUser.$relatedQuery('flows');
  const baseQuery = isCreator ? userFlows : allFlows;

  let flow = await baseQuery
    .clone()
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  const newActiveValue = params.input.active;

  if (flow.active === newActiveValue) {
    return flow;
  }

  const triggerStep = await flow.getTriggerStep();

  if (triggerStep.status === 'incomplete') {
    throw flow.IncompleteStepsError;
  }

  const trigger = await triggerStep.getTriggerCommand();
  const interval = trigger.getInterval?.(triggerStep.parameters);
  const repeatOptions = {
    pattern: interval || EVERY_15_MINUTES_CRON,
  };

  if (trigger.type === 'webhook') {
    const $ = await globalVariable({
      flow,
      connection: await triggerStep.$relatedQuery('connection'),
      app: await triggerStep.getApp(),
      step: triggerStep,
      testRun: false,
    });

    if (newActiveValue && trigger.registerHook) {
      await trigger.registerHook($);
    } else if (!newActiveValue && trigger.unregisterHook) {
      await trigger.unregisterHook($);
    }
  } else {
    if (newActiveValue) {
      flow = await flow.$query().patchAndFetch({
        publishedAt: new Date().toISOString(),
      });

      const jobName = `${JOB_NAME}-${flow.id}`;

      await flowQueue.add(
        jobName,
        { flowId: flow.id },
        {
          repeat: repeatOptions,
          jobId: flow.id,
          removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
          removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
        }
      );
    } else {
      const repeatableJobs = await flowQueue.getRepeatableJobs();
      const job = repeatableJobs.find((job) => job.id === flow.id);

      await flowQueue.removeRepeatableByKey(job.key);
    }
  }

  flow = await flow.$query().withGraphFetched('steps').patchAndFetch({
    active: newActiveValue,
  });

  return flow;
};

export default updateFlowStatus;
