import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const triggers = await App.findTriggersByKey(request.params.appKey);

  renderObject(response, triggers, { serializer: 'Trigger' });
};
