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

// TODO: access
const updateUser = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const user = await User.query()
    .patchAndFetchById(
      params.input.id,
      {
        email: params.input.email,
        fullName: params.input.fullName,
        roleId: params.input.role.id,
      }
    );

  return user;
};

export default updateUser;
