import User from '../../models/user';

type Params = {
  input: {
    email: string;
  };
};

const forgotPassword = async (_parent: unknown, params: Params) => {
  const { email } = params.input;

  const user = await User.query().findOne({ email });

  if (!user) {
    throw new Error('Email address not found!');
  }

  await user.generateResetPasswordToken();
  // TODO: Send email with reset password link

  return;
};

export default forgotPassword;
