export default async (request, response) => {
  const flow = await request.currentUser.authorizedFlows
    .findById(request.params.flowId)
    .throwIfNotFound();

  const { exportedFlowAsString, slug } = await flow.export();

  response.status(201).attachment(slug).send(exportedFlowAsString);
};
