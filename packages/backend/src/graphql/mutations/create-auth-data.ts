import Context from '../../types/express/context';
import App from '../../models/app';

type Params = {
  id: string;
};

const createAuthData = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${connection.key}`)).default;
  const appData = App.findOneByKey(connection.key);

  const appInstance = new appClass(appData, {
    consumerKey: connection.formattedData.consumerKey,
    consumerSecret: connection.formattedData.consumerSecret,
  });

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
