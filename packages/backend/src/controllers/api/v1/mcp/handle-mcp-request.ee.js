export default async function handleMcpRequest(request, response) {
  await request.transport.handleRequest(request, response, request.body);
}
