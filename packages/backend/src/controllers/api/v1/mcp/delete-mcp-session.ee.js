import mcpSessionManager from '@/helpers/mcp-sessions.js';

export default async function deleteMcpSession(request, response) {
  const { transport, mcpSessionId } = request;

  await transport.handleDeleteRequest(request, response);

  mcpSessionManager.remove(mcpSessionId);
  response.status(204).end();
}
