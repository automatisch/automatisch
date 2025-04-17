import { renderObject } from '../../../../../../helpers/renderer.js';
import OAuthClient from '../../../../../../models/oauth-client.js';

export default async (request, response) => {
  const oauthClient = await OAuthClient.query()
    .findById(request.params.oauthClientId)
    .throwIfNotFound();

  await oauthClient.$query().patchAndFetch(oauthClientParams(request));

  renderObject(response, oauthClient);
};

const oauthClientParams = (request) => {
  const { active, name, formattedAuthDefaults } = request.body;

  return {
    active,
    name,
    formattedAuthDefaults,
  };
};
