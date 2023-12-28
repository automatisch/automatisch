const updateFlow = async (_parent, params, context) => {
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
