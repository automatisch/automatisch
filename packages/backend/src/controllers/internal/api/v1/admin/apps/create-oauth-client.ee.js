import { renderObject } from '../../../../../../helpers/renderer.js';
import AppConfig from '../../../../../../models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query()
    .findOne({ key: request.params.appKey })
    .throwIfNotFound();

  const oauthClient = await appConfig.createOAuthClient(
    oauthClientParams(request)
  );

  renderObject(response, oauthClient, { status: 201 });
};

const oauthClientParams = (request) => {
  const { active, appKey, name, formattedAuthDefaults } = request.body;

  return {
    active,
    appKey,
    name,
    formattedAuthDefaults,
  };
};
