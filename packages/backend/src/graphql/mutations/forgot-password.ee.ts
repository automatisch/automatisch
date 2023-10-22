import appConfig from '../../config/app';
import User from '../../models/user';
import emailQueue from '../../queues/email';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../../helpers/remove-job-configuration';

type Params = {
  input: {
    email: string;
  };
};

const forgotPassword = async (_parent: unknown, params: Params) => {
  const { email } = params.input;

  const user = await User.query().findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('Email address not found!');
  }

  await user.generateResetPasswordToken();

  const jobName = `Reset Password Email - ${user.id}`;

  const jobPayload = {
    email: user.email,
    subject: 'Reset Password',
    template: 'reset-password-instructions',
    params: {
      token: user.resetPasswordToken,
      webAppUrl: appConfig.webAppUrl,
      fullName: user.fullName,
    },
  };

  const jobOptions = {
    removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
    removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  };

  await emailQueue.add(jobName, jobPayload, jobOptions);

  return true;
};

export default forgotPassword;
