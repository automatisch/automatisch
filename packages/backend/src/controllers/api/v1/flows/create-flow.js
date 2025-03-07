import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.createEmptyFlow();

  renderObject(response, flow, { status: 201 });
};
