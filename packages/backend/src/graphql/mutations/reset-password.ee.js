import User from '../../models/user';

const resetPassword = async (_parent, params) => {
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
