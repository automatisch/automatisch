import { IRequest } from '@automatisch/types';
import Subscription from '../../models/subscription.ee';
import Billing from './index.ee';

const handleSubscriptionCreated = async (request: IRequest) => {
  const subscription = await Subscription.query().insertAndFetch(
    formatSubscription(request)
  );
  await subscription
    .$relatedQuery('usageData')
    .insert(formatUsageData(request));
};

const handleSubscriptionUpdated = async (request: IRequest) => {
  await Subscription.query()
    .findOne({
      paddle_subscription_id: request.body.subscription_id,
    })
    .patch(formatSubscription(request));
};

const handleSubscriptionCancelled = async (request: IRequest) => {
  const subscription = await Subscription.query().findOne({
    paddle_subscription_id: request.body.subscription_id,
  });

  await subscription.$query().patchAndFetch(formatSubscription(request));
};

const handleSubscriptionPaymentSucceeded = async (request: IRequest) => {
  const subscription = await Subscription.query()
    .findOne({
      paddle_subscription_id: request.body.subscription_id,
    })
    .throwIfNotFound();

  const remoteSubscription = await Billing.paddleClient.getSubscription(
    Number(subscription.paddleSubscriptionId)
  );

  await subscription.$query().patch({
    nextBillAmount: remoteSubscription.next_payment.amount.toFixed(2),
    nextBillDate: remoteSubscription.next_payment.date,
    lastBillDate: remoteSubscription.last_payment.date,
  });

  await subscription
    .$relatedQuery('usageData')
    .insert(formatUsageData(request));
};

const formatSubscription = (request: IRequest) => {
  return {
    userId: JSON.parse(request.body.passthrough).id,
    paddleSubscriptionId: request.body.subscription_id,
    paddlePlanId: request.body.subscription_plan_id,
    cancelUrl: request.body.cancel_url,
    updateUrl: request.body.update_url,
    status: request.body.status,
    nextBillDate: request.body.next_bill_date,
    nextBillAmount: request.body.unit_price,
    cancellationEffectiveDate: request.body.cancellation_effective_date,
  };
};

const formatUsageData = (request: IRequest) => {
  return {
    userId: JSON.parse(request.body.passthrough).id,
    consumedTaskCount: 0,
    nextResetAt: request.body.next_bill_date,
  };
};

const webhooks = {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionCancelled,
  handleSubscriptionPaymentSucceeded,
};

export default webhooks;
