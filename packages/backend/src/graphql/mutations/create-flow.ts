import App from '../../models/app';
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
  context.currentUser.can('create', 'Flow');

  const connectionId = params?.input?.connectionId;
  const appKey = params?.input?.triggerAppKey;

  if (appKey) {
    await App.findOneByKey(appKey);
  }

  const flow = await context.currentUser.$relatedQuery('flows').insert({
    name: 'Name your flow',
  });

  if (connectionId) {
    const connection = await context.currentUser
      .relatedConnectionsQuery()
      .findById(connectionId);

    if (!connection) {
      throw new Error('The connection does not exist!');
    }
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
