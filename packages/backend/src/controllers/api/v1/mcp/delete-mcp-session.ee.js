import McpSession from '@/models/mcp-session.ee.js';

export default async function deleteMcpSession(request, response) {
  const { transport, mcpSessionId } = request;

  await transport.handleDeleteRequest(request, response);

  McpSession.removeRuntime(mcpSessionId);
  response.status(204).end();
}
