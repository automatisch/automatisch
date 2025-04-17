import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const folder = await request.currentUser
    .$relatedQuery('folders')
    .insertAndFetch({
      name: request.body.name,
    });

  renderObject(response, folder, { status: 201 });
};
