import { renderObject } from '../../../../../helpers/renderer.js';
import OAuthClient from '../../../../../models/oauth-client.js';

export default async (request, response) => {
  const oauthClient = await OAuthClient.query()
    .findById(request.params.oauthClientId)
    .where({ app_key: request.params.appKey, active: true })
    .throwIfNotFound();

  renderObject(response, oauthClient);
};
