export default async (request, response) => {
  const step = await request.currentUser.authorizedSteps
    .findById(request.params.stepId)
    .throwIfNotFound();

  await step.delete();

  response.status(204).end();
};
