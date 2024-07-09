import appConfig from '../../config/app.js';
import User from '../../models/user.js';
import Role from '../../models/role.js';
import emailQueue from '../../queues/email.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../../helpers/remove-job-configuration.js';

const createUser = async (_parent, params, context) => {
  context.currentUser.can('create', 'User');

  const { fullName, email } = params.input;

  const existingUser = await User.query().findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error('User already exists!');
  }

  const userPayload = {
    fullName,
    email,
    status: 'invited',
  };

  try {
    context.currentUser.can('update', 'Role');

    userPayload.roleId = params.input.role.id;
  } catch {
    // void
    const role = await Role.query().findOne({ key: 'admin' });
    userPayload.roleId = role.id;
  }

  const user = await User.query().insert(userPayload);

  await user.generateInvitationToken();

  const jobName = `Invitation Email - ${user.id}`;
  const acceptInvitationUrl = `${appConfig.webAppUrl}/accept-invitation?token=${user.invitationToken}`;

  const jobPayload = {
    email: user.email,
    subject: 'You are invited!',
    template: 'invitation-instructions',
    params: {
      fullName: user.fullName,
      acceptInvitationUrl,
    },
  };

  const jobOptions = {
    removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
    removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  };

  await emailQueue.add(jobName, jobPayload, jobOptions);

  return { user, acceptInvitationUrl };
};

export default createUser;
