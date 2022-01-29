import { GraphQLNonNull } from 'graphql';
import Step from '../../models/step';
import stepType, { stepInputType } from '../types/step';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  input: {
    id: string;
    key: string;
    appKey: string;
    parameters: string;
    flow: {
      id: string;
    };
    connection: {
      id: string;
    };
  };
};
const updateStepResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const { input } = params;

  let step = await req.currentUser
    .$relatedQuery('steps')
    .findOne({
      'steps.id': input.id,
      flow_id: input.flow.id,
    })
    .throwIfNotFound();

  step = await Step.query().patchAndFetchById(input.id, {
    key: input.key,
    appKey: input.appKey,
    connectionId: input.connection.id,
    parameters: input.parameters,
  });

  return step;
};

const updateStep = {
  type: stepType,
  args: {
    input: { type: new GraphQLNonNull(stepInputType) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    updateStepResolver(params, req),
};

export default updateStep;
