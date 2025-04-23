import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.authorizedFlows
    .findOne({
      id: request.params.flowId,
    })
    .throwIfNotFound();

  await flow.$query().patchAndFetch({
    name: request.body.name,
  });

  renderObject(response, flow);
};
