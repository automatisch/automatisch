import { IJSONObject } from '@automatisch/types';
import App from '../../models/app';
import Step from '../../models/step';
import Connection from '../../models/connection';
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
  const { isCreator } = context.currentUser.can('update', 'Flow');
  const userSteps = context.currentUser.$relatedQuery('steps');
  const allSteps = Step.query();
  const baseQuery = isCreator ? userSteps : allSteps;

  const { input } = params;

  let step = await baseQuery
    .findOne({
      'steps.id': input.id,
      flow_id: input.flow.id,
    })
    .throwIfNotFound();

  if (input.connection.id) {
    let canSeeAllConnections = false;
    try {
      const conditions = context.currentUser.can('read', 'Connection');

      canSeeAllConnections = !conditions.isCreator;
    } catch {
      // The user does not have permission to read any connections!
      throw new Error('The connection does not exist!');
    }

    const userConnections = context.currentUser.relatedConnectionsQuery();
    const allConnections = Connection.query();
    const baseConnectionsQuery = canSeeAllConnections ? allConnections : userConnections;

    const connection = await baseConnectionsQuery
      .clone()
      .findById(input.connection?.id)

    if (!connection) {
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

  await step.updateWebhookUrl();

  return step;
};

export default updateStep;
