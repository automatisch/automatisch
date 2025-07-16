import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.readableFlows
    .findById(request.params.flowId)
    .throwIfNotFound();

  const duplicatedFlow = await flow.duplicateFor(request.currentUser);

  renderObject(response, duplicatedFlow, { status: 201 });
};
