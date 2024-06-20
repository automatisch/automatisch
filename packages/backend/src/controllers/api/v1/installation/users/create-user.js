import User from '../../../../../models/user.js';

export default async (request, response) => {
  const { email, password, fullName } = request.body;

  await User.createAdmin({ email, password, fullName });

  response.status(204).end();
};
