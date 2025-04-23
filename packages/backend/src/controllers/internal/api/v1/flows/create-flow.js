import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const { templateId } = request.query;

  const flow = templateId
    ? await request.currentUser.createFlowFromTemplate(templateId)
    : await request.currentUser.createEmptyFlow();

  renderObject(response, flow, { status: 201 });
};
