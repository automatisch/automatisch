import User from '../../../../models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  await user.softRemove();

  response.status(204).end();
};
