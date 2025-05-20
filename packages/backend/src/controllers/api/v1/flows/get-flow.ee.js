import Flow from '../../../../models/flow.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await Flow.query()
    .withGraphJoined({ steps: true })
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': request.params.flowId })
    .throwIfNotFound();

  renderObject(response, flow);
};
