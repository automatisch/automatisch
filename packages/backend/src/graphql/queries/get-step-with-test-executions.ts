import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import stepType from '../types/step';

type Params = {
  stepId: string;
};

const getStepWithTestExecutionsResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const step = await req.currentUser
    .$relatedQuery('steps')
    .findOne({ 'steps.id': params.stepId })
    .throwIfNotFound();

  const previousStepsWithCurrentStep = await req.currentUser
    .$relatedQuery('steps')
    .withGraphJoined('executionSteps')
    .where('flow_id', '=', step.flowId)
    .andWhere('position', '<', step.position)
    .distinctOn('executionSteps.step_id')
    .orderBy([
      'executionSteps.step_id',
      { column: 'executionSteps.created_at', order: 'desc' },
    ]);

  return previousStepsWithCurrentStep;
};

const getStepWithTestExecutions = {
  type: GraphQLList(stepType),
  args: {
    stepId: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    getStepWithTestExecutionsResolver(params, req),
};

export default getStepWithTestExecutions;
