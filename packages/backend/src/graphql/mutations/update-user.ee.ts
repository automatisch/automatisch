import Context from '../../types/express/context';
import User from '../../models/user';

type Params = {
  input: {
    id: string;
    email: string;
    fullName: string;
    role: {
      id: string;
    };
  };
};

const updateUser = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'User');

  const userPayload: Partial<User> = {
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
