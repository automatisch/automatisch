import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .insertAndFetch(agentParams(request));

  renderObject(response, agent, { status: 201 });
};

const agentParams = (request) => {
  const { name, description, instructions } = request.body;

  return {
    name,
    description,
    instructions,
  };
};
