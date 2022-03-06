import Context from '../../types/express/context';
import App from '../../models/app';

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
  const appData = App.findOneByKey(connection.key);

  const appInstance = new appClass(appData, connection.formattedData);
  const isStillVerified =
    await appInstance.authenticationClient.isStillVerified();

  connection = await connection.$query().patchAndFetch({
    formattedData: connection.formattedData,
    verified: isStillVerified,
  });

  return connection;
};

export default testConnection;
