import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser
    .$relatedQuery('flows')
    .findOne({ id: request.params.flowId })
    .throwIfNotFound();

  try {
    const folder = await flow.$relatedQuery('folder').throwIfNotFound();
    renderObject(response, folder);
  } catch (error) {
    // If no folder is associated with the flow, return null
    if (error.name === 'NotFoundError') {
      renderObject(response, null);
    } else {
      // For other errors, rethrow
      throw error;
    }
  }
};
