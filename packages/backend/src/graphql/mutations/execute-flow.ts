import { GraphQLString, GraphQLNonNull } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import executeFlowType from '../types/execute-flow';

type Params = {
  stepId: string;
  data: Record<string, unknown>;
};
const executeFlowResolver = async (
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

  await step.$query().patch({
    status: 'completed',
  });

  return { data, step };
};

const executeFlow = {
  type: executeFlowType,
  args: {
    stepId: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    executeFlowResolver(params, req),
};

export default executeFlow;
