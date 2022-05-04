import Context from '../../types/express/context';
import App from '../../models/app';

type Params = {
  input: {
    id: string;
  };
};

const createAuthData = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${connection.key}`)).default;
  const appData = App.findOneByKey(connection.key);

  if (!connection.formattedData) { return null; }

  const appInstance = new appClass(appData, connection.formattedData);
  const authLink = await appInstance.authenticationClient.createAuthData();

  await connection.$query().patch({
    formattedData: {
      ...connection.formattedData,
      ...authLink,
    },
  });

  return authLink;
};

export default createAuthData;
