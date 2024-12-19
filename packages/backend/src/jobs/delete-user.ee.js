import appConfig from '../config/app.js';
import User from '../models/user.js';
import ExecutionStep from '../models/execution-step.js';

export const deleteUserJob = async (job) => {
  const { id } = job.data;

  const user = await User.query()
    .withSoftDeleted()
    .findById(id)
    .throwIfNotFound();

  const executionIds = (
    await user
      .$relatedQuery('executions')
      .withSoftDeleted()
      .select('executions.id')
  ).map((execution) => execution.id);

  await ExecutionStep.query()
    .withSoftDeleted()
    .whereIn('execution_id', executionIds)
    .hardDelete();
  await user.$relatedQuery('executions').withSoftDeleted().hardDelete();
  await user.$relatedQuery('steps').withSoftDeleted().hardDelete();
  await user.$relatedQuery('flows').withSoftDeleted().hardDelete();
  await user.$relatedQuery('connections').withSoftDeleted().hardDelete();
  await user.$relatedQuery('identities').withSoftDeleted().hardDelete();

  if (appConfig.isCloud) {
    await user.$relatedQuery('subscriptions').withSoftDeleted().hardDelete();
    await user.$relatedQuery('usageData').withSoftDeleted().hardDelete();
  }

  await user.$relatedQuery('accessTokens').withSoftDeleted().hardDelete();
  await user.$query().withSoftDeleted().hardDelete();
};
