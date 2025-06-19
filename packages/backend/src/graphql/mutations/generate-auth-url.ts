import Context from '../../types/express/context';
import globalVariable from '../../helpers/global-variable';
import App from '../../models/app';

type Params = {
  input: {
    id: string;
  };
};

const generateAuthUrl = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('create', 'Connection');

  const connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  if (!connection.formattedData) {
    return null;
  }

  const authInstance = (await import(`../../apps/${connection.key}/auth`))
    .default;
  const app = await App.findOneByKey(connection.key);

  const $ = await globalVariable({ connection, app });
  await authInstance.generateAuthUrl($);

  return connection.formattedData;
};

export default generateAuthUrl;
