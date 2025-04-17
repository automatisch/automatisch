import { renderObject } from '../../../../../../helpers/renderer.js';
import OAuthClient from '../../../../../../models/oauth-client.js';

export default async (request, response) => {
  const oauthClients = await OAuthClient.query()
    .where({ app_key: request.params.appKey })
    .orderBy('created_at', 'desc');

  renderObject(response, oauthClients);
};
