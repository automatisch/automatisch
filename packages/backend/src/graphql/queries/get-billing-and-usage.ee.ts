import Context from '../../types/express/context';
import Billing from '../../helpers/billing/index.ee';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';
import { DateTime } from 'luxon';

type Subscription = {
  monthlyQuota: string;
  status: string;
  nextBillDate: string;
  nextBillAmount: string;
  updateUrl: string;
  cancelUrl: string;
};

const getBillingAndUsage = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  const persistedSubscription = await context.currentUser.$relatedQuery(
    'subscription'
  );

  let subscription: Subscription;

  if (persistedSubscription) {
    const currentPlan = Billing.paddlePlans.find(
      (plan) => plan.productId === persistedSubscription.paddlePlanId
    );

    subscription = {
      monthlyQuota: currentPlan.limit,
      status: persistedSubscription.status,
      nextBillDate: persistedSubscription.nextBillDate,
      nextBillAmount: '€' + persistedSubscription.nextBillAmount,
      updateUrl: persistedSubscription.updateUrl,
      cancelUrl: persistedSubscription.cancelUrl,
    };
  } else {
    subscription = {
      monthlyQuota: 'Free trial',
      status: null,
      nextBillDate: '---',
      nextBillAmount: '---',
      updateUrl: null,
      cancelUrl: null,
    };
  }

  const executionIds = (
    await context.currentUser
      .$relatedQuery('executions')
      .select('executions.id')
  ).map((execution: Execution) => execution.id);

  const executionStepCount = await ExecutionStep.query()
    .whereIn('execution_id', executionIds)
    .andWhere(
      'created_at',
      '>=',
      DateTime.now().minus({ days: 30 }).toFormat('D')
    )
    .count()
    .first();

  return {
    subscription,
    usage: {
      task: executionStepCount.count,
    },
  };
};

export default getBillingAndUsage;
