import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

export default async (request, response) => {
  const { templateId, userId } = request.body;

  const user = await User.query().findById(userId).throwIfNotFound();

  const flow = templateId
    ? await user.createFlowFromTemplate(templateId)
    : await user.createEmptyFlow();

  renderObject(response, flow, { status: 201 });
};
