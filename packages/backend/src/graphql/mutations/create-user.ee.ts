import User from '../../models/user';

type Params = {
  input: {
    email: string;
    password: string;
    fullName: string;
  };
};

const createUser = async (_parent: unknown, params: Params) => {
  const { email, password, fullName } = params.input;

  const existingUser = await User.query().findOne({ email });

  if (existingUser) {
    throw new Error('User already exists!');
  }

  const user = await User.query().insert({
    email,
    password,
    fullName,
    role: 'user',
  });

  return user;
};

export default createUser;
