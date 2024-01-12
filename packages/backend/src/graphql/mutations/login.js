import User from '../../models/user.js';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id.js';

const login = async (_parent, params) => {
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
