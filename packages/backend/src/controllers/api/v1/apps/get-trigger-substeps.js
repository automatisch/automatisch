import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const substeps = await App.findTriggerSubsteps(
    request.params.appKey,
    request.params.triggerKey
  );

  renderObject(response, substeps);
};
