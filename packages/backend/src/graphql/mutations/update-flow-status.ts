import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
    active: boolean;
  };
};

const updateFlowStatus = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let flow = await context.currentUser
    .$relatedQuery('flows')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  if (flow.active === params.input.active) {
    return flow;
  }

  flow = await flow.$query().patchAndFetch({
    active: params.input.active,
  });

  return flow;
};

export default updateFlowStatus;
