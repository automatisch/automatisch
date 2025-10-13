import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agents = await request.currentUser
    .$relatedQuery('agents')
    .orderBy('created_at', 'desc');

  renderObject(response, agents);
};
