import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import Flow from '../../models/flow';
import Step from '../../models/step';
import stepType from '../types/step';
import availableAppsEnumType from '../types/available-apps-enum-type';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: number,
  flowId: number,
  key: string,
  appKey: string,
  connectionId: number
}
const updateStepResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const flow = await Flow.query().findOne({
    user_id: req.currentUser.id,
    id: params.flowId
  }).throwIfNotFound();

  let step = await Step.query().findOne({
    flow_id: flow.id,
    id: params.id
  }).throwIfNotFound();

  step = await step.$query().patchAndFetch({
    ...step,
    key: params.key,
    appKey: params.appKey,
    connectionId: params.connectionId
  })

  return step;
}

const updateStep = {
  type: stepType,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    flowId: { type: GraphQLNonNull(GraphQLInt) },
    key: { type: GraphQLString },
    appKey: { type: availableAppsEnumType },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => updateStepResolver(params, req)
};

export default updateStep;
