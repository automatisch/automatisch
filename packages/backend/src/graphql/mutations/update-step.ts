import { IJSONObject } from '@automatisch/types';
import App from '../../models/app';
import Step from '../../models/step';
import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
    key: string;
    appKey: string;
    parameters: IJSONObject;
    flow: {
      id: string;
    };
    connection: {
      id: string;
    };
  };
};

const updateStep = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const { input } = params;

  let step = await context.currentUser
    .$relatedQuery('steps')
    .findOne({
      'steps.id': input.id,
      flow_id: input.flow.id,
    })
    .throwIfNotFound();

  if (input.connection.id) {
    const hasConnection = await context.currentUser
      .$relatedQuery('connections')
      .findById(input.connection?.id);

    if (!hasConnection) {
      throw new Error('The connection does not exist!');
    }
  }

  if (step.isTrigger) {
    await App.checkAppAndTrigger(input.appKey, input.key);
  }

  if (step.isAction) {
    await App.checkAppAndAction(input.appKey, input.key);
  }

  step = await Step.query()
    .patchAndFetchById(input.id, {
      key: input.key,
      appKey: input.appKey,
      connectionId: input.connection.id,
      parameters: input.parameters,
    })
    .withGraphFetched('connection');

  return step;
};

export default updateStep;
