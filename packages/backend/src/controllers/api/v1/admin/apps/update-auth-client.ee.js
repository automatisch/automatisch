import { renderObject } from '../../../../../helpers/renderer.js';
import AppAuthClient from '../../../../../models/app-auth-client.js';

export default async (request, response) => {
  const appAuthClient = await AppAuthClient.query()
    .findById(request.params.appAuthClientId)
    .throwIfNotFound();

  await appAuthClient.$query().patchAndFetch(appAuthClientParams(request));

  renderObject(response, appAuthClient);
};

const appAuthClientParams = (request) => {
  const { active, name, formattedAuthDefaults } = request.body;

  return {
    active,
    name,
    formattedAuthDefaults,
  };
};
