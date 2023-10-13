import User from '../../models/user';
import Role from '../../models/role';

type Params = {
  input: {
    fullName: string;
    email: string;
    password: string;
  };
};

const registerUser = async (_parent: unknown, params: Params) => {
  const { fullName, email, password } = params.input;

  const existingUser = await User.query().findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error('User already exists!');
  }

  const role = await Role.query().findOne({ key: 'user' });

  const user = await User.query().insert({
    fullName,
    email,
    password,
    roleId: role.id,
  });

  return user;
};

export default registerUser;
