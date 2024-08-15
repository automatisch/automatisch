import { DateTime } from 'luxon';
import { createUser } from './user';
import Subscription from '../../src/models/subscription.ee.js';

export const createSubscription = async (params = {}) => {
  params.userId = params?.userId || (await createUser()).id;
  params.paddleSubscriptionId =
    params?.paddleSubscriptionId || 'paddleSubscriptionId';

  params.paddlePlanId = params?.paddlePlanId || '47384';
  params.updateUrl = params?.updateUrl || 'https://example.com/update-url';
  params.cancelUrl = params?.cancelUrl || 'https://example.com/cancel-url';
  params.status = params?.status || 'active';
  params.nextBillAmount = params?.nextBillAmount || '20';
  params.nextBillDate =
    params?.nextBillDate || DateTime.now().plus({ days: 30 }).toISODate();

  const subscription = await Subscription.query().insertAndFetch(params);

  return subscription;
};
