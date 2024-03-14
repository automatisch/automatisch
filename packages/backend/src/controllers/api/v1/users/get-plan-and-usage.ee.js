import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const planAndUsage = await request.currentUser.getPlanAndUsage();

  renderObject(response, planAndUsage);
};
