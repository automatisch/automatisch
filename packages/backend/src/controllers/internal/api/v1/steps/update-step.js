import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  let step = await request.currentUser.authorizedSteps
    .findById(request.params.stepId)
    .throwIfNotFound();

  step = await step.updateFor(request.currentUser, stepParams(request));

  renderObject(response, step);
};

const stepParams = (request) => {
  const { connectionId, appKey, key, name, parameters } = request.body;

  return {
    connectionId,
    appKey,
    key,
    name,
    parameters,
  };
};
