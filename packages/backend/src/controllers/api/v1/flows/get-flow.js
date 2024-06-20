import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.authorizedFlows
    .clone()
    .withGraphJoined({ steps: true })
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': request.params.flowId })
    .throwIfNotFound();

  renderObject(response, flow);
};
