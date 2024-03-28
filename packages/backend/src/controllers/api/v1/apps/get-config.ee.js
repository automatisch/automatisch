import { renderObject } from '../../../../helpers/renderer.js';
import AppConfig from '../../../../models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query()
    .withGraphFetched({
      appAuthClients: true,
    })
    .findOne({
      key: request.params.appKey,
    })
    .throwIfNotFound();

  renderObject(response, appConfig);
};
