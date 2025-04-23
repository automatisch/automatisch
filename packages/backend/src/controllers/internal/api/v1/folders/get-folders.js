import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const folders = await request.currentUser
    .$relatedQuery('folders')
    .orderBy('name', 'asc');

  renderObject(response, folders);
};
