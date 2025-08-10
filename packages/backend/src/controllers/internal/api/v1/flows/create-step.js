import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.readableFlows
    .clone()
    .findById(request.params.flowId)
    .throwIfNotFound();

  const { previousStepId, structuralType, parentStepId } = request.body;

  const createdActionStep = await flow.createStepAfter(previousStepId, {
    structuralType,
    parentStepId,
  });

  renderObject(response, createdActionStep, { status: 201 });
};
