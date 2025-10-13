import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findOne({
      id: request.params.agentId,
    })
    .throwIfNotFound();

  renderObject(response, agent);
};
