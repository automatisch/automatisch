import App from '../../models/app.js';
import AppConfig from '../../models/app-config.js';

const createConnection = async (_parent, params, context) => {
  context.currentUser.can('create', 'Connection');

  const { key, appAuthClientId } = params.input;

  const app = await App.findOneByKey(key);

  const appConfig = await AppConfig.query().findOne({ key });

  let formattedData = params.input.formattedData;
  if (appConfig) {
    if (appConfig.disabled)
      throw new Error(
        'This application has been disabled for new connections!'
      );

    if (!appConfig.allowCustomConnection && formattedData)
      throw new Error(`Custom connections cannot be created for ${app.name}!`);

    if (appConfig.shared && !formattedData) {
      const authClient = await appConfig
        .$relatedQuery('appAuthClients')
        .findById(appAuthClientId)
        .where({
          active: true,
        })
        .throwIfNotFound();

      formattedData = authClient.formattedAuthDefaults;
    }
  }

  const createdConnection = await context.currentUser
    .$relatedQuery('connections')
    .insert({
      key,
      appAuthClientId,
      formattedData,
      verified: false,
    });

  return createdConnection;
};

export default createConnection;
