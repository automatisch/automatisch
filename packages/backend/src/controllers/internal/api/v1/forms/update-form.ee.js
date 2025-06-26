import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const form = await request.currentUser
    .$relatedQuery('forms')
    .findOne({
      id: request.params.formId,
    })
    .throwIfNotFound();

  await form.$query().patchAndFetch({
    name: request.body.name,
    display_name: request.body.displayName,
    response_message: request.body.responseMessage,
    description: request.body.description,
    fields: request.body.fields,
  });

  renderObject(response, form);
};
