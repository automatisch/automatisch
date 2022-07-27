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
  const app = App.findOneByKey(connection.key);

  const appInstance = new appClass(app, connection.formattedData);
  const verifiedCredentials =
    await appInstance.authenticationClient.verifyCredentials();

  connection = await connection.$query().patchAndFetch({
    formattedData: {
      ...connection.formattedData,
      ...verifiedCredentials,
    },
    verified: true,
    draft: false,
  });

  return {
    ...connection,
    app,
  };
};

export default verifyConnection;
