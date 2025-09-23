import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const mcpServers = await request.currentUser
    .$relatedQuery('mcpServers')
    .orderBy('created_at', 'desc');

  renderObject(response, mcpServers);
};
