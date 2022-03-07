import Context from '../../types/express/context';

type Params = {
  id: string;
  name: string;
  active: boolean;
};

const updateFlow = async (
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

  flow = await flow.$query().patchAndFetch({
    name: params.name,
    active: params.active,
  });

  return flow;
};

export default updateFlow;
