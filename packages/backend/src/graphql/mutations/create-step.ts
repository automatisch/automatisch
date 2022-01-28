import { GraphQLNonNull } from 'graphql';
import Step from '../../models/step';
import Flow from '../../models/flow';
import stepType, { stepInputType } from '../types/step';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

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

  const flow = await Flow.query()
    .findOne({
      id: input.flow.id,
      user_id: req.currentUser.id,
    })
    .throwIfNotFound();

  const previousStep = await Step.query()
    .findOne({
      id: input.previousStep.id,
      flow_id: flow.id,
    })
    .throwIfNotFound();

  const step = await Step.query().insertAndFetch({
    flowId: flow.id,
    key: input.key,
    appKey: input.appKey,
    type: 'action',
    connectionId: input.connection?.id,
    position: previousStep.position + 1,
  });

  const nextSteps = await Step.query()
    .where({
      flow_id: flow.id,
    })
    .andWhere('position', '>=', step.position)
    .whereNot('id', step.id);

  const nextStepQueries = nextSteps.map(async (nextStep, index) => {
    await nextStep.$query().patchAndFetch({
      ...nextStep,
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
