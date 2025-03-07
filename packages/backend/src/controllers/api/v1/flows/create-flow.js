import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = !request.query.templateId
    ? await request.currentUser.createEmptyFlow()
    : await request.currentUser.createFlowFromTemplate(
        request.query.templateId,
        response
      );

  return renderObject(response, flow, { status: 201 });
};
