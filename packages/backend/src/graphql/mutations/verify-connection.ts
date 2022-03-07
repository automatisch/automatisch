import Context from '../../types/express/context';
import App from '../../models/app';

type Params = {
  input: {
    id: string;
  };
};

const verifyConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${connection.key}`)).default;
  const appData = App.findOneByKey(connection.key);

  const appInstance = new appClass(appData, connection.formattedData);
  const verifiedCredentials =
    await appInstance.authenticationClient.verifyCredentials();

  connection = await connection.$query().patchAndFetch({
    formattedData: {
      ...connection.formattedData,
      ...verifiedCredentials,
    },
    verified: true,
  });

  return connection;
};

export default verifyConnection;
