import { renderObject } from '@/helpers/renderer.js';
import Form from '@/models/form.ee.js';

export default async (request, response) => {
  const form = await Form.query()
    .findById(request.params.formId)
    .throwIfNotFound();

  renderObject(response, form);
};
