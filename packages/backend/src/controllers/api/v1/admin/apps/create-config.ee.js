import { renderObject } from '../../../../../helpers/renderer.js';
import AppConfig from '../../../../../models/app-config.js';

export default async (request, response) => {
  const createdAppConfig = await AppConfig.query().insertAndFetch(
    appConfigParams(request)
  );

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
