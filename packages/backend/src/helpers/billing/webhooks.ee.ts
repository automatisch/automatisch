import { IRequest } from '@automatisch/types';
import Subscription from '../../models/subscription.ee';

const handleSubscriptionCreated = async (request: IRequest) => {
  await Subscription.query().insertAndFetch(formatSubscription(request));
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
    nextBillAmount: request.body.next_bill_amount,
  };
};

const webhooks = {
  handleSubscriptionCreated,
};

export default webhooks;
