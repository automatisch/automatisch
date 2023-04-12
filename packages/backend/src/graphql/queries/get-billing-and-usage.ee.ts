import { DateTime } from 'luxon';
import { TSubscription } from '@automatisch/types';

import Context from '../../types/express/context';
import Billing from '../../helpers/billing/index.ee';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';
import Subscription from '../../models/subscription.ee';

const getBillingAndUsage = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  const persistedSubscription = await context.currentUser.$relatedQuery(
    'currentSubscription'
  );

  const subscription = persistedSubscription
    ? paidSubscription(persistedSubscription)
    : freeTrialSubscription();

  return {
    subscription,
    usage: {
      task: executionStepCount(context),
    },
  };
};

const paidSubscription = (subscription: Subscription): TSubscription => {
  const currentPlan = Billing.paddlePlans.find(
    (plan) => plan.productId === subscription.paddlePlanId
  );

  return {
    status: subscription.status,
    monthlyQuota: {
      title: currentPlan.limit,
      action: {
        type: 'link',
        text: 'Cancel plan',
        src: subscription.cancelUrl,
      },
    },
    nextBillAmount: {
      title: subscription.nextBillAmount
        ? '€' + subscription.nextBillAmount
        : '---',
      action: {
        type: 'link',
        text: 'Update payment method',
        src: subscription.updateUrl,
      },
    },
    nextBillDate: {
      title: subscription.nextBillDate ? subscription.nextBillDate : '---',
      action: {
        type: 'text',
        text: '(monthly payment)',
      },
    },
  };
};

const freeTrialSubscription = (): TSubscription => {
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
