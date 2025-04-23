import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser
    .$relatedQuery('flows')
    .findOne({ id: request.params.flowId })
    .throwIfNotFound();

  const folder = await flow.$relatedQuery('folder').throwIfNotFound();

  renderObject(response, folder);
};
