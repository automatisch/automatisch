import Context from '../../types/express/context';
import Billing from '../../helpers/billing/index.ee';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';
import Subscription from '../../models/subscription.ee';
import { DateTime } from 'luxon';

type ComputedSubscription = {
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

  const subscription: ComputedSubscription = persistedSubscription
    ? paidSubscription(persistedSubscription)
    : freeTrialSubscription();

  return {
    subscription,
    usage: {
      task: executionStepCount(context),
    },
  };
};

const paidSubscription = (subscription: Subscription): ComputedSubscription => {
  const currentPlan = Billing.paddlePlans.find(
    (plan) => plan.productId === subscription.paddlePlanId
  );

  return {
    monthlyQuota: currentPlan.limit,
    status: subscription.status,
    nextBillDate: subscription.nextBillDate,
    nextBillAmount: '€' + subscription.nextBillAmount,
    updateUrl: subscription.updateUrl,
    cancelUrl: subscription.cancelUrl,
  };
};

const freeTrialSubscription = (): ComputedSubscription => {
  return {
    monthlyQuota: 'Free trial',
    status: null,
    nextBillDate: '---',
    nextBillAmount: '---',
    updateUrl: null,
    cancelUrl: null,
  };
};

const executionIds = async (context: Context) => {
  return (
    await context.currentUser
      .$relatedQuery('executions')
      .select('executions.id')
  ).map((execution: Execution) => execution.id);
};

const executionStepCount = async (context: Context) => {
  const executionStepCount = await ExecutionStep.query()
    .whereIn('execution_id', await executionIds(context))
    .andWhere(
      'created_at',
      '>=',
      DateTime.now().minus({ days: 30 }).toISODate()
    )
    .count()
    .first();

  return executionStepCount.count;
};

export default getBillingAndUsage;
