import Step from '../../models/step';
import Context from '../../types/express/context';

type Params = {
  input: {
    triggerAppKey: string;
    connectionId: string;
  };
};

const createFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const connectionId = params?.input?.connectionId;
  const appKey = params?.input?.triggerAppKey;

  const flow = await context.currentUser.$relatedQuery('flows').insert({
    name: 'Name your flow',
  });

  if (connectionId) {
    await context.currentUser
      .$relatedQuery('connections')
      .findById(connectionId)
      .throwIfNotFound();
  }

  await Step.query().insert({
    flowId: flow.id,
    type: 'trigger',
    position: 1,
    appKey,
    connectionId,
  });

  await Step.query().insert({
    flowId: flow.id,
    type: 'action',
    position: 2,
  });

  return flow;
};

export default createFlow;
