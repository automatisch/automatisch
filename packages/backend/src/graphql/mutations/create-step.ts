import { GraphQLNonNull } from 'graphql';
import stepType, { stepInputType } from '../types/step';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import { StepType } from '../../types/step';

type Params = {
  input: {
    key: string;
    appKey: string;
    flow: {
      id: number;
    };
    connection: {
      id: number;
    };
    previousStep: {
      id: number;
    };
  };
};

const createStepResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  const { input } = params;

  const flow = await req.currentUser
    .$relatedQuery('flows')
    .findOne({
      id: input.flow.id,
    })
    .throwIfNotFound();

  const previousStep = await flow
    .$relatedQuery('steps')
    .findOne({
      id: input.previousStep.id,
    })
    .throwIfNotFound();

  const step = await flow.$relatedQuery('steps').insertAndFetch({
    key: input.key,
    appKey: input.appKey,
    type: StepType.Action,
    position: previousStep.position + 1,
    parameters: {},
  });

  const nextSteps = await flow
    .$relatedQuery('steps')
    .where('position', '>=', step.position)
    .whereNot('id', step.id);

  const nextStepQueries = nextSteps.map(async (nextStep, index) => {
    await nextStep.$query().patchAndFetch({
      position: step.position + index + 1,
    });
  });

  await Promise.all(nextStepQueries);

  return step;
};

const createStep = {
  type: stepType,
  args: {
    input: { type: new GraphQLNonNull(stepInputType) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    createStepResolver(params, req),
};

export default createStep;
