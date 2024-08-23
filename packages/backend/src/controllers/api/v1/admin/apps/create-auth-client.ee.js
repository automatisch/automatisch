import { renderObject } from '../../../../../helpers/renderer.js';
import AppConfig from '../../../../../models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query()
    .findOne({ key: request.params.appKey })
    .throwIfNotFound();

  const appAuthClient = await appConfig
    .$relatedQuery('appAuthClients')
    .insert(request.body);

  renderObject(response, appAuthClient, { status: 201 });
};
