import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

export default async (request, response) => {
  const user = await User.query().insertAndFetch(userParams(request));
  await user.sendInvitationEmail();

  renderObject(response, user, {
    status: 201,
    serializer: 'PublicUserInvitation',
  });
};

const userParams = (request) => {
  const { fullName, email, roleId } = request.body;

  return {
    fullName,
    status: 'invited',
    email: email?.toLowerCase(),
    roleId,
  };
};
