import { Duration } from 'luxon';
import Context from '../../types/express/context';
import deleteUserQueue from '../../queues/delete-user.ee';
import flowQueue from '../../queues/flow';
import Flow from '../../models/flow';
import Execution from '../../models/execution';
import User from '../../models/user';
import ExecutionStep from '../../models/execution-step';
import appConfig from '../../config/app';

const deleteCurrentUser = async (
  _parent: unknown,
  params: never,
  context: Context
) => {
  const id = context.currentUser.id;

  try {
    await User.transaction(async (trx) => {
      const flows = await context.currentUser
        .$relatedQuery('flows', trx)
        .where({
          active: true,
        });

      const { count } = await context.currentUser
        .$relatedQuery('connections', trx)
        .joinRelated('sharedConnections')
        .joinRelated('steps')
        .join('flows', function () {
          this
            .on(
              'flows.id', '=', 'steps.flow_id'
            )
            .andOnVal(
              'flows.user_id', '<>', id
            )
            .andOnVal(
              'flows.active', '=', true
            )
        })
        .count()
        .first();

      if (count) {
        throw new Error('The shared connections must be removed first!');
      }

      const executionIds = (
        await context.currentUser
          .$relatedQuery('executions', trx)
          .select('executions.id')
      ).map((execution: Execution) => execution.id);
      const flowIds = flows.map((flow) => flow.id);

      await ExecutionStep.query(trx).delete().whereIn('execution_id', executionIds);
      await context.currentUser.$relatedQuery('executions', trx).delete();
      await context.currentUser.$relatedQuery('steps', trx).delete();
      await Flow.query(trx).whereIn('id', flowIds).delete();
      await context.currentUser.$relatedQuery('connections', trx).delete();
      await context.currentUser.$relatedQuery('identities', trx).delete();

      if (appConfig.isCloud) {
        await context.currentUser.$relatedQuery('subscriptions', trx).delete();
        await context.currentUser.$relatedQuery('usageData', trx).delete();
      }

      await context.currentUser.$query(trx).delete();

      const jobName = `Delete user - ${id}`;
      const jobPayload = { id };
      const millisecondsFor30Days = Duration.fromObject({ days: 30 }).toMillis();
      const jobOptions = {
        delay: millisecondsFor30Days,
      };

      // must be done as the last action as this cannot be reverted via the transaction!
      const repeatableJobs = await flowQueue.getRepeatableJobs();

      for (const flow of flows) {
        const job = repeatableJobs.find((job) => job.id === flow.id);

        if (job) {
          await flowQueue.removeRepeatableByKey(job.key);
        }
      }

      await deleteUserQueue.add(jobName, jobPayload, jobOptions);
    });

    return true;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error('The user deletion has failed!');
  }
};

export default deleteCurrentUser;
