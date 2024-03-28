import { renderObject } from '../../../../helpers/renderer.js';
import AppAuthClient from '../../../../models/app-auth-client.js';

export default async (request, response) => {
  const appAuthClients = await AppAuthClient.query()
    .where({ app_key: request.params.appKey, active: true })
    .orderBy('created_at', 'desc');

  renderObject(response, appAuthClients);
};
