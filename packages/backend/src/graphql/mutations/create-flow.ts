import Step from '../../models/step';
import flowType from '../types/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

const createFlowResolver = async (req: RequestWithCurrentUser) => {
  const flow = await req.currentUser.$relatedQuery('flows').insert();

  await Step.query().insert({
    flowId: flow.id,
    type: 'trigger',
    position: 1,
  });

  return flow;
};

const createFlow = {
  type: flowType,
  resolve: (_: any, _params: any, req: RequestWithCurrentUser) =>
    createFlowResolver(req),
};

export default createFlow;
