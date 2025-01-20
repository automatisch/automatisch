import { renderObject } from '../../../../helpers/renderer.js';
import importFlow from '../../../../helpers/import-flow.js';

export default async function importFlowController(request, response) {
  const flow = await importFlow(
    request.currentUser,
    flowParams(request),
    response
  );

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
