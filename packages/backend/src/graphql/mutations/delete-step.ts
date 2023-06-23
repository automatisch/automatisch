import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
  };
};

const deleteStep = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'Flow');

  const step = await context.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('flow')
    .findOne({
      'steps.id': params.input.id,
    })
    .throwIfNotFound();

  await step.$relatedQuery('executionSteps').delete();
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

export default deleteStep;
