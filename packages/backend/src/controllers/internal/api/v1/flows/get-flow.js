import Flow from '../../../../../models/flow.js';
import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.authorizedFlows
    .clone()
    .withGraphJoined({ steps: true })
    .select(
      Flow.raw('flows.user_id = ? as "isOwner"', [request.currentUser.id])
    )
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': request.params.flowId })
    .throwIfNotFound();

  renderObject(response, flow);
};
