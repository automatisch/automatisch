import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const step = await request.currentUser.authorizedSteps
    .findById(request.params.stepId)
    .throwIfNotFound();

  const connection = await step.$relatedQuery('connection').throwIfNotFound();

  renderObject(response, connection);
};
