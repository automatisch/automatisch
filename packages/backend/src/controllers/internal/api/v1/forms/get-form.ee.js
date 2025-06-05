import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const form = await request.currentUser
    .$relatedQuery('forms')
    .findOne({
      id: request.params.formId,
    })
    .throwIfNotFound();

  renderObject(response, form);
};
