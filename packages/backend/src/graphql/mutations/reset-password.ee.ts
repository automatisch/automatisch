import User from '../../models/user';

type Params = {
  input: {
    token: string;
    password: string;
  };
};

const resetPassword = async (_parent: unknown, params: Params) => {
  const { token, password } = params.input;

  if (!token) {
    throw new Error('Reset password token is required!');
  }

  const user = await User.query().findOne({ reset_password_token: token });

  if (!user || !user.isResetPasswordTokenValid()) {
    throw new Error(
      'Reset password link is not valid or expired. Try generating a new link.'
    );
  }

  await user.resetPassword(password);

  return true;
};

export default resetPassword;
