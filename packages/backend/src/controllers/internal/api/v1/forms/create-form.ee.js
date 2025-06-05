import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const form = await request.currentUser.$relatedQuery('forms').insertAndFetch({
    name: request.body.name,
    fields: request.body.fields,
  });

  renderObject(response, form, { status: 201 });
};
