import Flow from '../../models/flow';
import Step from '../../models/step';
import flowType from '../types/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

const createFlowResolver = async (req: RequestWithCurrentUser) => {
  const flow = await Flow.query().insert({
    userId: req.currentUser.id
  });

  await Step.query().insert({
    flowId: flow.id,
    type: 'trigger'
  })

  return flow;
}

const createFlow = {
  type: flowType,
  resolve: (_: any, _params: any, req: RequestWithCurrentUser) => createFlowResolver(req)
};

export default createFlow;
