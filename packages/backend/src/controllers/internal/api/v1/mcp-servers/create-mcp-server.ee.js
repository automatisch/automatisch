import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .insertAndFetch({
      name: request.body.name,
    });

  renderObject(response, mcpServer, { status: 201 });
};
