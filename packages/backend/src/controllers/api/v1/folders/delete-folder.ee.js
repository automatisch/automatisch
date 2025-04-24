import Folder from '../../../../models/folder.js';

export default async (request, response) => {
  const folder = await Folder.query()
    .findById(request.params.folderId)
    .throwIfNotFound();

  await folder.delete();

  response.status(204).end();
};
