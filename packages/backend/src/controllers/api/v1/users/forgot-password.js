import User from '../../../../models/user.js';

export default async (request, response) => {
  const { email } = request.body;

  const user = await User.query()
    .findOne({ email: email.toLowerCase() })
    .throwIfNotFound();

  await user.sendResetPasswordEmail();

  response.status(204).end();
};
