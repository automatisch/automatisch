import User from '../../models/user';
import deleteUserQueue from '../../queues/delete-user.ee';
import { Duration } from 'luxon';

type Params = {
  input: {
    id: string;
  };
};

const deleteUser = async (_parent: unknown, params: Params) => {
  const { id } = params.input;
  await User
    .query()
    .findById(id)
    .delete()
    .throwIfNotFound();

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
