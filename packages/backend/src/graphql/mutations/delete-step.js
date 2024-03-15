import Step from '../../models/step.js';

const deleteStep = async (_parent, params, context) => {
  const conditions = context.currentUser.can('update', 'Flow');
  const isCreator = conditions.isCreator;
  const allSteps = Step.query();
  const userSteps = context.currentUser.$relatedQuery('steps');
  const baseQuery = isCreator ? userSteps : allSteps;

  const step = await baseQuery
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
