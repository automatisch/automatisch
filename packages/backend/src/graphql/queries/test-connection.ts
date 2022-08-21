import Context from '../../types/express/context';

type Params = {
  id: string;
  data: object;
};

const testConnection = async (
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

  const appClass = (await import(`../../apps/${connection.key}`)).default;
  const appInstance = new appClass(connection);

  const isStillVerified =
    await appInstance.authenticationClient.isStillVerified();

  connection = await connection.$query().patchAndFetch({
    formattedData: connection.formattedData,
    verified: isStillVerified,
  });

  return connection;
};

export default testConnection;
