import { IRequest } from '@automatisch/types';
import Subscription from '../../models/subscription.ee';
import Billing from './index.ee';

const handleSubscriptionCreated = async (request: IRequest) => {
  await Subscription.query().insertAndFetch(formatSubscription(request));
};

const handleSubscriptionPaymentSucceeded = async (request: IRequest) => {
  const subscription = await Subscription.query()
    .findOne({
      paddleSubscriptionId: request.body.subscription_id,
    })
    .throwIfNotFound();

  const remoteSubscription = await Billing.paddleClient.getSubscriptionPlan(
    Number(subscription.paddleSubscriptionId)
  );

  await subscription.$query().patch({
    nextBillAmount: remoteSubscription.next_payment.amount.toFixed(2),
    nextBillDate: remoteSubscription.next_payment.date,
    lastBillDate: remoteSubscription.last_payment.date,
  });
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
  };
};

const webhooks = {
  handleSubscriptionCreated,
  handleSubscriptionPaymentSucceeded,
};

export default webhooks;
