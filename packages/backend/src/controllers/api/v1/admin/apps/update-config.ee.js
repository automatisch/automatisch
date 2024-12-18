import { renderObject } from '../../../../../helpers/renderer.js';
import AppConfig from '../../../../../models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query()
    .findOne({
      key: request.params.appKey,
    })
    .throwIfNotFound();

  await appConfig.$query().patchAndFetch({
    ...appConfigParams(request),
    key: request.params.appKey,
  });

  renderObject(response, appConfig);
};

const appConfigParams = (request) => {
  const { useOnlyPredefinedAuthClients, disabled } = request.body;

  return {
    useOnlyPredefinedAuthClients,
    disabled,
  };
};
