import crypto from 'crypto';
import { serialize } from 'php-serialize';
import Billing from '../../helpers/billing/index.ee.js';
import appConfig from '../../config/app.js';

export default async (request, response) => {
  if (!verifyWebhook(request)) {
    return response.sendStatus(401);
  }

  if (request.body.alert_name === 'subscription_created') {
    await Billing.webhooks.handleSubscriptionCreated(request);
  } else if (request.body.alert_name === 'subscription_updated') {
    await Billing.webhooks.handleSubscriptionUpdated(request);
  } else if (request.body.alert_name === 'subscription_cancelled') {
    await Billing.webhooks.handleSubscriptionCancelled(request);
  } else if (request.body.alert_name === 'subscription_payment_succeeded') {
    await Billing.webhooks.handleSubscriptionPaymentSucceeded(request);
  }

  return response.sendStatus(200);
};

const verifyWebhook = (request) => {
  const signature = request.body.p_signature;

  const keys = Object.keys(request.body)
    .filter((key) => key !== 'p_signature')
    .sort();

  const sorted = {};
  keys.forEach((key) => {
    sorted[key] = request.body[key];
  });

  const serialized = serialize(sorted);

  try {
    const verifier = crypto.createVerify('sha1');
    verifier.write(serialized);
    verifier.end();

    return verifier.verify(appConfig.paddlePublicKey, signature, 'base64');
  } catch (err) {
    return false;
  }
};
