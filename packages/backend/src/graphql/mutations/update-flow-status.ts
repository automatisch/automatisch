import Context from '../../types/express/context';
import processorQueue from '../../queues/processor';

type Params = {
  input: {
    id: string;
    active: boolean;
  };
};

const JOB_NAME = 'processorJob';
const REPEAT_OPTIONS = {
  every: 60000, // 1 minute
};

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

  if (flow.active) {
    await processorQueue.add(
      JOB_NAME,
      { flowId: flow.id },
      {
        repeat: REPEAT_OPTIONS,
        jobId: flow.id,
      }
    );
  } else {
    await processorQueue.removeRepeatable(JOB_NAME, REPEAT_OPTIONS, flow.id);
  }

  return flow;
};

export default updateFlowStatus;
