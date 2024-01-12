import { Duration } from 'luxon';
import deleteUserQueue from '../../queues/delete-user.ee.js';
import flowQueue from '../../queues/flow.js';
import Flow from '../../models/flow.js';
import ExecutionStep from '../../models/execution-step.js';
import appConfig from '../../config/app.js';

const deleteCurrentUser = async (_parent, params, context) => {
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
  ).map((execution) => execution.id);
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
