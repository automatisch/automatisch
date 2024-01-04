import { Duration } from 'luxon';
import User from '../../models/user';
import deleteUserQueue from '../../queues/delete-user.ee';

const deleteUser = async (_parent, params, context) => {
  context.currentUser.can('delete', 'User');

  const id = params.input.id;

  await User.query().deleteById(id);

  const jobName = `Delete user - ${id}`;
  const jobPayload = { id };
  const millisecondsFor30Days = Duration.fromObject({ days: 30 }).toMillis();
  const jobOptions = {
    delay: millisecondsFor30Days,
  };

  await deleteUserQueue.add(jobName, jobPayload, jobOptions);

  return true;
};

export default deleteUser;
