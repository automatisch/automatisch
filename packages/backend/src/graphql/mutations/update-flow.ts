import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
    name: string;
  };
};

const updateFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'Flow');

  let flow = await context.currentUser
    .$relatedQuery('flows')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  flow = await flow.$query().patchAndFetch({
    name: params.input.name,
  });

  return flow;
};

export default updateFlow;
