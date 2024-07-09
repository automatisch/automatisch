import User from '../../../../models/user.js';

export default async (request, response) => {
  const { token, password } = request.body;

  if (!token) {
    throw new Error('Invitation token is required!');
  }

  const user = await User.query()
    .findOne({ invitation_token: token })
    .throwIfNotFound();

  if (!user.isInvitationTokenValid()) {
    return response.status(422).end();
  }

  await user.acceptInvitation(password);

  response.status(204).end();
};
