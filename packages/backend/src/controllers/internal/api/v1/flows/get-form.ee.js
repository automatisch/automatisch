import { renderObject } from '@/helpers/renderer.js';
import Flow from '@/models/flow.js';

export default async (request, response) => {
  const flow = await Flow.query()
    .findOne({ id: request.params.flowId })
    .throwIfNotFound();

  const publicForm = await flow.getPublicForm();

  renderObject(response, publicForm, { serializer: 'PublicForm' });
};
