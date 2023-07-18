import { Duration } from 'luxon';
import Context from '../../types/express/context';
import User from '../../models/user';
import deleteUserQueue from '../../queues/delete-user.ee';

type Params = {
  input: {
    id: string;
  };
};

const deleteUser = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('delete', 'User');

  const id = params.input.id;

  await User.query().deleteById(id);

  const jobName = `Delete user - ${id}`;
  const jobPayload = { id };
  const millisecondsFor30Days = Duration.fromObject({ days: 30 }).toMillis();
  const jobOptions = {
    delay: millisecondsFor30Days
  };

  await deleteUserQueue.add(jobName, jobPayload, jobOptions);

  return true;
};

export default deleteUser;
