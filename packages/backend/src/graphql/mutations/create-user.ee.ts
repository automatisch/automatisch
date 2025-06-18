import User from '../../models/user';

type Params = {
  input: {
    fullName: string;
    email: string;
    password: string;
    roleId: string;
  };
};

// TODO: access
const createUser = async (_parent: unknown, params: Params) => {
  const { fullName, email, password, roleId } = params.input;

  const existingUser = await User.query().findOne({ email });

  if (existingUser) {
    throw new Error('User already exists!');
  }

  const user = await User.query().insert({
    fullName,
    email,
    password,
    roleId,
  });

  return user;
};

export default createUser;
