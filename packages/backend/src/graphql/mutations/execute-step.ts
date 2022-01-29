import { GraphQLString, GraphQLNonNull } from 'graphql';
import stepType from '../types/step';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string;
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
      'steps.id': params.id,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${step.appKey}`)).default;
  const appInstance = new appClass(step.connection.data);
  await appInstance.triggers[step.key].run();

  return step;
};

const executeStep = {
  type: stepType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    executeStepResolver(params, req),
};

export default executeStep;
