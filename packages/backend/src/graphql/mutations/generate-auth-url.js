import globalVariable from '../../helpers/global-variable.js';
import App from '../../models/app.js';

const generateAuthUrl = async (_parent, params, context) => {
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

  const authInstance = (
    await import(`../../apps/${connection.key}/auth/index.js`)
  ).default;

  const app = await App.findOneByKey(connection.key);

  const $ = await globalVariable({ connection, app });
  await authInstance.generateAuthUrl($);

  return connection.formattedData;
};

export default generateAuthUrl;
