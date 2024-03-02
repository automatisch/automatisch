import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const substeps = await App.findActionSubsteps(
    request.params.appKey,
    request.params.actionKey
  );

  renderObject(response, substeps);
};
