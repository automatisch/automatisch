import appConfig from '../../config/app';
import Context from '../../types/express/context';

// TODO: remove as getBillingAndUsageData query has been introduced
const getUsageData = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  if (!appConfig.isCloud) return;

  const usageData = await context.currentUser
    .$relatedQuery('currentUsageData')
    .throwIfNotFound();

  const subscription = await usageData
    .$relatedQuery('subscription')
    .throwIfNotFound();

  const plan = subscription.plan;

  const computedUsageData = {
    name: plan.name,
    allowedTaskCount: plan.quota,
    consumedTaskCount: usageData.consumedTaskCount,
    remainingTaskCount: plan.quota - usageData.consumedTaskCount,
    nextResetAt: usageData.nextResetAt,
  };

  return computedUsageData;
};

export default getUsageData;
