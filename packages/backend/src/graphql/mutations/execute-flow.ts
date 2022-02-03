import { GraphQLString, GraphQLNonNull } from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  stepId: string;
  data: Record<string, unknown>;
};
const executeStepResolver = async (
  params: Params,
  req: RequestWithCurrentUser
): Promise<any> => {
  const step = await req.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('connection')
    .findOne({
      'steps.id': params.stepId,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${step.appKey}`)).default;
  const appInstance = new appClass(step.connection.data);
  const data = await appInstance.triggers[step.key].run();

  return { data };
};

const executeStep = {
  type: GraphQLJSONObject,
  args: {
    stepId: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    executeStepResolver(params, req),
};

export default executeStep;
