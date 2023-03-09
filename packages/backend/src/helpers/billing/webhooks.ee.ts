import Stripe from 'stripe';
import PaymentPlan from '../../models/payment-plan.ee';
import Billing from './index.ee';

const handleWebhooks = async (event: Stripe.Event) => {
  const trackedWebhookTypes = [
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ];

  if (!trackedWebhookTypes.includes(event.type)) {
    return;
  }

  await updatePaymentPlan(event);
};

const updatePaymentPlan = async (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;
  const priceKey = subscription.items.data[0].plan.id;
  const plan = Billing.plans.find((plan) => plan.price === priceKey);

  const paymentPlan = await PaymentPlan.query().findOne({
    stripe_customer_id: subscription.customer,
  });

  await paymentPlan.$query().patchAndFetch({
    name: plan.name,
    taskCount: plan.taskCount,
    stripeSubscriptionId: subscription.id,
  });

  const user = await paymentPlan.$relatedQuery('user');
  const usageData = await user.$relatedQuery('usageData');

  await usageData.$query().patchAndFetch({
    nextResetAt: new Date(subscription.current_period_end * 1000).toISOString(),
  });
};

export default handleWebhooks;
