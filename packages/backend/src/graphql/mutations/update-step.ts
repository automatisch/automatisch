import { IJSONObject } from '@automatisch/types';
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
