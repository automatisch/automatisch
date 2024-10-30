import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.authorizedFlows
    .clone()
    .findById(request.params.flowId)
    .throwIfNotFound();

  const createdActionStep = await flow.createActionStepAfterStepId(
    request.body.previousStepId
  );

  renderObject(response, createdActionStep, { status: 201 });
};
