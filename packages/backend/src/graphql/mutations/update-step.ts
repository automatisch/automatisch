import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import Flow from '../../models/flow';
import Step from '../../models/step';
import stepType, { stepInputType } from '../types/step';
import availableAppsEnumType from '../types/available-apps-enum-type';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  input: {
    id: number,
    key: string,
    appKey: string,
    flow: {
      id: number,
    },
    connection: {
      id: number
    },
  }
}
const updateStepResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const { input } = params;

  const flow = await Flow.query().findOne({
    user_id: req.currentUser.id,
    id: input.flow.id
  }).throwIfNotFound();

  let step = await Step.query().findOne({
    flow_id: flow.id,
    id: input.id
  }).throwIfNotFound();

  step = await Step.query().patchAndFetchById(input.id, {
    key: input.key,
    appKey: input.appKey,
    connectionId: input.connection.id,
  });

  return step;
}

const updateStep = {
  type: stepType,
  args: {
    input: { type: new GraphQLNonNull(stepInputType) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => updateStepResolver(params, req)
};

export default updateStep;
