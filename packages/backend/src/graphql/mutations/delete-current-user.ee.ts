import { Duration } from 'luxon';
import Context from '../../types/express/context';
import deleteUserQueue from '../../queues/delete-user.ee';
import flowQueue from '../../queues/flow';
import Flow from '../../models/flow';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';
import appConfig from '../../config/app';

const deleteCurrentUser = async (
  _parent: unknown,
  params: never,
  context: Context
) => {
  const id = context.currentUser.id;

  const flows = await context.currentUser.$relatedQuery('flows').where({
    active: true,
  });

  const repeatableJobs = await flowQueue.getRepeatableJobs();

  for (const flow of flows) {
    const job = repeatableJobs.find((job) => job.id === flow.id);

    if (job) {
      await flowQueue.removeRepeatableByKey(job.key);
    }
  }

  const executionIds = (
    await context.currentUser
      .$relatedQuery('executions')
      .select('executions.id')
  ).map((execution: Execution) => execution.id);
  const flowIds = flows.map((flow) => flow.id);

  await ExecutionStep.query().delete().whereIn('execution_id', executionIds);
  await context.currentUser.$relatedQuery('executions').delete();
  await context.currentUser.$relatedQuery('steps').delete();
  await Flow.query().whereIn('id', flowIds).delete();
  await context.currentUser.$relatedQuery('connections').delete();
  await context.currentUser.$relatedQuery('identities').delete();

  if (appConfig.isCloud) {
    await context.currentUser.$relatedQuery('subscriptions').delete();
    await context.currentUser.$relatedQuery('usageData').delete();
  }

  await context.currentUser.$query().delete();

  const jobName = `Delete user - ${id}`;
  const jobPayload = { id };
  const millisecondsFor30Days = Duration.fromObject({ days: 30 }).toMillis();
  const jobOptions = {
    delay: millisecondsFor30Days,
  };

  await deleteUserQueue.add(jobName, jobPayload, jobOptions);

  return true;
};

export default deleteCurrentUser;
