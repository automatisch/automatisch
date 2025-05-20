import Flow from '../../../../models/flow.js';

export default async (request, response) => {
  const flow = await Flow.query()
    .findById(request.params.flowId)
    .throwIfNotFound();

  await flow.delete();

  response.status(204).end();
};
