import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const forms = await request.currentUser
    .$relatedQuery('forms')
    .orderBy('created_at', 'desc');

  renderObject(response, forms);
};
