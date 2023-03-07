import appConfig from '../../config/app';
import Context from '../../types/express/context';

const getUsageData = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  if (!appConfig.isCloud) return;

  const usageData = await context.currentUser
    .$relatedQuery('usageData')
    .throwIfNotFound();

  const paymentPlan = await context.currentUser
    .$relatedQuery('paymentPlan')
    .throwIfNotFound();

  const computedUsageData = {
    name: paymentPlan.name,
    allowedTaskCount: paymentPlan.taskCount,
    consumedTaskCount: usageData.consumedTaskCount,
    remainingTaskCount: paymentPlan.taskCount - usageData.consumedTaskCount,
    nextResetAt: usageData.nextResetAt,
  };

  return computedUsageData;
};

export default getUsageData;
