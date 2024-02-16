import appConfig from '../../../../config/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  renderObject(response, { version: appConfig.version });
};
