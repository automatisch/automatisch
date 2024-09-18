import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  let step = await request.currentUser.authorizedSteps
    .findById(request.params.stepId)
    .throwIfNotFound();

  const stepData = stepParams(request);

  if (stepData.connectionId && (stepData.appKey || step.appKey)) {
    await request.currentUser.authorizedConnections
      .findOne({
        id: stepData.connectionId,
        key: stepData.appKey || step.appKey,
      })
      .throwIfNotFound();
  }

  step = await step.update(stepData);

  renderObject(response, step);
};

const stepParams = (request) => {
  const { connectionId, appKey, key, parameters } = request.body;

  return {
    connectionId,
    appKey,
    key,
    parameters,
  };
};
