import { GraphQLString, GraphQLNonNull } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import stepType from '../types/step';

type Params = {
  id: string;
};

const deleteStepResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const step = await req.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('flow')
    .findOne({
      'steps.id': params.id,
    })
    .throwIfNotFound();

  await step.$query().delete();

  const nextSteps = await step.flow
    .$relatedQuery('steps')
    .where('position', '>', step.position);

  const nextStepQueries = nextSteps.map(async (nextStep) => {
    await nextStep.$query().patch({
      position: nextStep.position - 1,
    });
  });

  await Promise.all(nextStepQueries);

  step.flow = await step.flow
    .$query()
    .withGraphJoined('steps')
    .orderBy('steps.position', 'asc');

  return step;
};

const deleteStep = {
  type: stepType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    deleteStepResolver(params, req),
};

export default deleteStep;
