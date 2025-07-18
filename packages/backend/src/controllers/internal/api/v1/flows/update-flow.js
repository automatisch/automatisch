import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.readableFlows
    .findOne({
      id: request.params.flowId,
    })
    .throwIfNotFound();

  await flow.$query().patchAndFetch({
    name: request.body.name,
    executionInterval: request.body.executionInterval,
  });

  renderObject(response, flow);
};
