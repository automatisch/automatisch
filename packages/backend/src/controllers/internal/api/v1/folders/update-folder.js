import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  const folder = await request.currentUser
    .$relatedQuery('folders')
    .findOne({
      id: request.params.folderId,
    })
    .throwIfNotFound();

  await folder.$query().patchAndFetch({
    name: request.body.name,
  });

  renderObject(response, folder);
};
