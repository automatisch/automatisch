import Flow from '../../../../models/flow.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  let flow = await Flow.query()
    .findOne({
      id: request.params.flowId,
    })
    .throwIfNotFound();

  flow = await flow.updateStatus(request.body.active);

  renderObject(response, flow);
};
