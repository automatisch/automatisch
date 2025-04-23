import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const app = await App.findOneByKey(request.params.appKey);

  renderObject(response, app, { serializer: 'App' });
};
