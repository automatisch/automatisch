import { renderObject } from '../../../../../helpers/renderer.js';
import Flow from '../../../../../models/flow.js';

export default async function importFlowController(request, response) {
  const flow = await Flow.import(request.currentUser, flowParams(request));

  return renderObject(response, flow, { status: 201 });
}

const flowParams = (request) => {
  return {
    id: request.body.id,
    name: request.body.name,
    steps: request.body.steps.map((step) => ({
      id: step.id,
      key: step.key,
      name: step.name,
      appKey: step.appKey,
      type: step.type,
      parameters: step.parameters,
      position: step.position,
      webhookPath: step.webhookPath,
    })),
  };
};
