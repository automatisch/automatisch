import Stripe from 'stripe';
import User from '../../models/user';
import PaymentPlan from '../../models/payment-plan.ee';
import UsageData from '../../models/usage-data.ee';
import appConfig from '../../config/app';

const plans = [
  {
    price: appConfig.stripeStarterPriceKey,
    name: 'Starter',
    taskCount: 1000,
    default: true,
  },
  {
    price: appConfig.stripeGrowthPriceKey,
    name: 'Growth',
    taskCount: 10000,
    default: false,
  },
];

const stripe = new Stripe(appConfig.stripeSecretKey, {
  apiVersion: '2022-11-15',
});

const createStripeCustomer = async (user: User) => {
  const params: Stripe.CustomerCreateParams = {
    email: user.email,
    name: user.fullName,
    description: `User ID: ${user.id}`,
  };

  return await stripe.customers.create(params);
};

const defaultPlan = plans.find((plan) => plan.default);

const createStripeSubscription = async (
  user: User,
  stripeCustomer: Stripe.Customer
) => {
  const params: Stripe.SubscriptionCreateParams = {
    customer: stripeCustomer.id,
    items: [{ price: defaultPlan.price }],
  };

  return await stripe.subscriptions.create(params);
};

const createSubscription = async (user: User) => {
  const stripeCustomer = await createStripeCustomer(user);
  const stripeSubscription = await createStripeSubscription(
    user,
    stripeCustomer
  );

  await PaymentPlan.query().insert({
    name: defaultPlan.name,
    taskCount: defaultPlan.taskCount,
    userId: user.id,
    stripeCustomerId: stripeCustomer.id,
    stripeSubscriptionId: stripeSubscription.id,
    currentPeriodStartedAt: new Date(
      stripeSubscription.current_period_start * 1000
    ).toISOString(),
    currentPeriodEndsAt: new Date(
      stripeSubscription.current_period_end * 1000
    ).toISOString(),
  });

  await UsageData.query().insert({
    userId: user.id,
    consumedTaskCount: 0,
    nextResetAt: new Date(
      stripeSubscription.current_period_end * 1000
    ).toISOString(),
  });
};

const createPaymentPortalUrl = async (user: User) => {
  const paymentPlan = await user.$relatedQuery('paymentPlan');

  const userSession = await stripe.billingPortal.sessions.create({
    customer: paymentPlan.stripeCustomerId,
    return_url: 'https://cloud.automatisch.io',
  });

  return userSession.url;
};

const billing = {
  createSubscription,
  createPaymentPortalUrl,
};

export default billing;
