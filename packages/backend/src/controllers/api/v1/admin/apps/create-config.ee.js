import { renderError, renderObject } from '../../../../../helpers/renderer.js';
import AppConfig from '../../../../../models/app-config.js';

export default async (request, response) => {
  const appKey = request.params.appKey;

  const appConfig = await AppConfig.query()
    .findOne({ key: appKey });

  if (appConfig) {
    return renderError(response, [{ general: ['App config already exists.'] }], 409);
  }

  const createdAppConfig = await AppConfig
    .query()
    .insertAndFetch(appConfigParams(request));

  renderObject(response, createdAppConfig, { status: 201 });
};

const appConfigParams = (request) => {
  const { allowCustomConnection, shared, disabled } = request.body;

  return {
    key: request.params.appKey,
    allowCustomConnection,
    shared,
    disabled,
  };
};
