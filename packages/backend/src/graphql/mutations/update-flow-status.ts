import Context from '../../types/express/context';

type Params = {
  id: string;
  active: boolean;
};

const updateFlowStatus = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let flow = await context.currentUser
    .$relatedQuery('flows')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  if (flow.active === params.active) {
    return flow;
  }

  flow = await flow.$query().patchAndFetch({
    active: params.active,
  });

  return flow;
};

export default updateFlowStatus;
