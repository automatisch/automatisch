import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';
import Role from '@/models/role.js';

export default async (request, response) => {
  const params = await userParams(request);

  await User.checkEmailAvailability(params.email);

  const user = await User.query().insertAndFetch(params);
  await user.sendInvitationEmail();

  renderObject(response, user, { status: 201, serializer: 'AdminUser' });
};

const userParams = async (request) => {
  const { fullName, email } = request.body;
  const roleId = request.body.roleId || (await Role.findAdmin()).id;

  return {
    fullName,
    status: 'invited',
    email: email?.toLowerCase(),
    roleId,
  };
};
