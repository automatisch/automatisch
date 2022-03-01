import Step from '../../models/step';
import flowType, { flowInputType } from '../types/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  input: {
    triggerAppKey: string;
  };
};

const createFlowResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const appKey = params?.input?.triggerAppKey;

  const flow = await req.currentUser.$relatedQuery('flows').insert({
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

const createFlow = {
  type: flowType,
  args: {
    input: { type: flowInputType },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    createFlowResolver(params, req),
};

export default createFlow;
