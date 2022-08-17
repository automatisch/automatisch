import Context from '../../types/express/context';
import processorQueue from '../../queues/processor';

type Params = {
  input: {
    id: string;
    active: boolean;
  };
};

const JOB_NAME = 'processorJob';
const EVERY_15_MINUTES_CRON = '*/15 * * * *';

const updateFlowStatus = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let flow = await context.currentUser
    .$relatedQuery('flows')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  if (flow.active === params.input.active) {
    return flow;
  }

  flow = await flow.$query().withGraphFetched('steps').patchAndFetch({
    active: params.input.active,
  });

  const triggerStep = await flow.getTriggerStep();
  const trigger = await triggerStep.getTrigger();
  const interval = trigger.interval;
  const repeatOptions = {
    cron: interval || EVERY_15_MINUTES_CRON,
  };

  if (flow.active) {
    flow = await flow.$query().patchAndFetch({
      published_at: new Date().toISOString(),
    });

    await processorQueue.add(
      JOB_NAME,
      { flowId: flow.id },
      {
        repeat: repeatOptions,
        jobId: flow.id,
      }
    );
  } else {
    const repeatableJobs = await processorQueue.getRepeatableJobs();
    const job = repeatableJobs.find((job) => job.id === flow.id);

    await processorQueue.removeRepeatableByKey(job.key);
  }

  return flow;
};

export default updateFlowStatus;
