import App from '../../models/app';
import Flow from '../../models/flow';
import Context from '../../types/express/context';

type Params = {
  input: {
    key: string;
    appKey: string;
    flow: {
      id: string;
    };
    connection: {
      id: string;
    };
    previousStep: {
      id: string;
    };
  };
};

const createStep = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('update', 'Flow');
  const userFlows = context.currentUser.$relatedQuery('flows');
  const allFlows = Flow.query();
  const flowsQuery = conditions.isCreator ? userFlows : allFlows;

  const { input } = params;

  if (input.appKey && input.key) {
    await App.checkAppAndAction(input.appKey, input.key);
  }

  if (input.appKey && !input.key) {
    await App.findOneByKey(input.appKey);
  }

  const flow = await flowsQuery
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
    type: 'action',
    position: previousStep.position + 1,
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

export default createStep;
