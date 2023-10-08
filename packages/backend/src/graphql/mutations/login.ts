import User from '../../models/user';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';

type Params = {
  input: {
    email: string;
    password: string;
  };
};

const login = async (_parent: unknown, params: Params) => {
  const user = await User.query().findOne({
    email: params.input.email.toLowerCase(),
  });

  if (user && (await user.login(params.input.password))) {
    const token = createAuthTokenByUserId(user.id);
    return { token, user };
  }

  throw new Error('User could not be found.');
};

export default login;
