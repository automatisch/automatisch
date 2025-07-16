import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.readableFlows
    .findById(request.params.flowId)
    .throwIfNotFound();

  const exportedFlow = await flow.export();

  return renderObject(response, exportedFlow, { status: 201 });
};
