import User from '../../models/user.js';

const updateUser = async (_parent, params, context) => {
  context.currentUser.can('update', 'User');

  const userPayload = {
    email: params.input.email,
    fullName: params.input.fullName,
  };

  try {
    context.currentUser.can('update', 'Role');

    userPayload.roleId = params.input.role.id;
  } catch {
    // void
  }

  const user = await User.query().patchAndFetchById(
    params.input.id,
    userPayload
  );

  return user;
};

export default updateUser;
