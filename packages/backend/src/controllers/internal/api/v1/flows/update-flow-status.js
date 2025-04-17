import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  let flow = await request.currentUser.authorizedFlows
    .clone()
    .findOne({
      id: request.params.flowId,
    })
    .throwIfNotFound();

  flow = await flow.updateStatus(request.body.active);

  renderObject(response, flow);
};
