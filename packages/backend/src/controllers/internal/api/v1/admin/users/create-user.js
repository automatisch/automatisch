import { renderObject } from '@/helpers/renderer.js';
import { ValidationError } from 'objection';
import User from '@/models/user.js';
import Role from '@/models/role.js';

export default async (request, response) => {
  const params = await userParams(request);

  const existingUser = await User.query()
    .withSoftDeleted()
    .findOne({ email: params.email });

  if (existingUser) {
    if (existingUser.deletedAt) {
      throw new ValidationError({
        data: {
          email: [
            {
              message: 'A deleted user with this email already exists.',
            },
          ],
        },
        type: 'ValidationError',
      });
    } else {
      throw new ValidationError({
        data: {
          email: [
            {
              message: "'email' must be unique.",
            },
          ],
        },
        type: 'ValidationError',
      });
    }
  }

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
