import { renderObject } from '../../../../../helpers/renderer.js';
import AppConfig from '../../../../../models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query()
    .findOne({ key: request.params.appKey })
    .throwIfNotFound();

  const appAuthClient = await appConfig
    .$relatedQuery('appAuthClients')
    .insert(appAuthClientParams(request));

  renderObject(response, appAuthClient, { status: 201 });
};

const appAuthClientParams = (request) => {
  const { active, appKey, name, formattedAuthDefaults } = request.body;

  return {
    active,
    appKey,
    name,
    formattedAuthDefaults,
  };
};
