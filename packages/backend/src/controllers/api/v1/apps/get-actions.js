import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const actions = await App.findActionsByKey(request.params.appKey);

  renderObject(response, actions, { serializer: 'Action' });
};
