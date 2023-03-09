import Context from '../../types/express/context';
import deleteUserQueue from '../../queues/delete-user.ee';
import { Duration } from 'luxon';

const deleteUser = async (_parent: unknown, params: never, context: Context) => {
  const id = context.currentUser.id;

  await context.currentUser.$query().delete();

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
