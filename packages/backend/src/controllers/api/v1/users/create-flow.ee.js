import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

export default async (request, response) => {
  const { templateId } = request.query;

  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const flow = templateId
    ? await user.createFlowFromTemplate(templateId)
    : await user.createEmptyFlow();

  renderObject(response, flow, { status: 201 });
};
