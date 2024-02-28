import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const auth = await App.findAuthByKey(request.params.appKey);

  renderObject(response, auth, { serializer: 'Auth' });
};
