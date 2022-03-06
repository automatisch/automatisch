import Context from '../../types/express/context';

type Params = {
  id: string;
};

const resetConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  connection = await connection.$query().patchAndFetch({
    formattedData: { screenName: connection.formattedData.screenName },
  });

  return connection;
};

export default resetConnection;
