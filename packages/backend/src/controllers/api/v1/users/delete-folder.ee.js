import User from '../../../../models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const folder = await user
    .$relatedQuery('folders')
    .findById(request.params.folderId)
    .throwIfNotFound();

  await folder.delete();

  response.status(204).end();
};
