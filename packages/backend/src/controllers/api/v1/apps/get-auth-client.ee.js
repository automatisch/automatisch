import { renderObject } from '../../../../helpers/renderer.js';
import AppAuthClient from '../../../../models/app-auth-client.js';

export default async (request, response) => {
  const appAuthClient = await AppAuthClient.query()
    .findById(request.params.appAuthClientId)
    .where({ app_key: request.params.appKey, active: true })
    .throwIfNotFound();

  renderObject(response, appAuthClient);
};
