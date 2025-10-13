import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findOne({
      id: request.params.agentId,
    })
    .throwIfNotFound();

  await agent.$query().patchAndFetch(agentParams(request));

  renderObject(response, agent);
};

const agentParams = (request) => {
  const { name, description, instructions } = request.body;

  return {
    name,
    description,
    instructions,
  };
};
