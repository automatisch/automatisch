import Context from '../../types/express/context';
import Billing from '../../helpers/billing/index.ee';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';
import Subscription from '../../models/subscription.ee';
import { DateTime } from 'luxon';

type BillingCardAction = {
  type: string;
  text: string;
  src?: string | null;
};

type ComputedSubscription = {
  status: string;
  monthlyQuota: {
    title: string;
    action: BillingCardAction;
  };
  nextBillDate: {
    title: string;
    action: BillingCardAction;
  };
  nextBillAmount: {
    title: string;
    action: BillingCardAction;
  };
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
    status: subscription.status,
    monthlyQuota: {
      title: currentPlan.limit,
      action: {
        type: 'link',
        text: 'Change plan',
        src: '/settings/billing/change-plan',
      },
    },
    nextBillAmount: {
      title: '€' + subscription.nextBillAmount,
      action: {
        type: 'link',
        text: 'Update payment method',
        src: subscription.updateUrl,
      },
    },
    nextBillDate: {
      title: subscription.nextBillDate,
      action: {
        type: 'text',
        text: '(monthly payment)',
      },
    },
  };
};

const freeTrialSubscription = (): ComputedSubscription => {
  return {
    status: null,
    monthlyQuota: {
      title: 'Free Trial',
      action: {
        type: 'link',
        text: 'Upgrade plan',
        src: '/settings/billing/upgrade',
      },
    },
    nextBillAmount: {
      title: '---',
      action: null,
    },
    nextBillDate: {
      title: '---',
      action: null,
    },
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
