import Step from '../../models/step';
import Context from '../../types/express/context';

type Params = {
  input: {
    triggerAppKey: string;
  };
};

const createFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const appKey = params?.input?.triggerAppKey;

  const flow = await context.currentUser.$relatedQuery('flows').insert({
    name: 'Name your flow',
  });

  await Step.query().insert({
    flowId: flow.id,
    type: 'trigger',
    position: 1,
    appKey,
  });

  return flow;
};

export default createFlow;
