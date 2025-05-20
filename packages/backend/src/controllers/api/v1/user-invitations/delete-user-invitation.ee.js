import User from '../../../../models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .where({ status: 'invited' })
    .throwIfNotFound();

  await user.$query().delete();

  response.status(204).end();
};
