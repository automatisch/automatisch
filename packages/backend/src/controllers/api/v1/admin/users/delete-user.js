import User from '../../../../../models/user.js';

export default async (request, response) => {
  const id = request.params.userId;

  const user = await User.query().findById(id).throwIfNotFound();
  await user.softRemove();

  response.status(204).end();
};
