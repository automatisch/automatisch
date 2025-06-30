import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const form = await request.currentUser.$relatedQuery('forms').insertAndFetch({
    name: request.body.name,
    displayName: request.body.displayName,
    fields: request.body.fields,
    description: request.body.description,
    responseMessage: request.body.responseMessage,
    submitButtonText: request.body.submitButtonText,
  });

  renderObject(response, form, { status: 201 });
};
