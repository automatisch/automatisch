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
    throw new Error(
      'Invitation link is not valid or expired. You can use reset password to get a new link.'
    );
  }

  await user.acceptInvitation(password);

  response.status(204).end();
};
