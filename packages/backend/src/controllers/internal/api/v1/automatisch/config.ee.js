import Config from '../../../../../models/config.js';
import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const config = await Config.get();

  renderObject(response, config);
};
