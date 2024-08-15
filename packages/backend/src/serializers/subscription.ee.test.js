import { vi, describe, it, expect, beforeEach } from 'vitest';
import appConfig from '../config/app';
import { createUser } from '../../test/factories/user';
import { createSubscription } from '../../test/factories/subscription';
import subscriptionSerializer from './subscription.ee.js';

describe('subscriptionSerializer', () => {
  let user, subscription;

  beforeEach(async () => {
    user = await createUser();
    subscription = await createSubscription({ userId: user.id });
  });

  it('should return subscription data', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);

    const expectedPayload = {
      id: subscription.id,
      paddleSubscriptionId: subscription.paddleSubscriptionId,
      paddlePlanId: subscription.paddlePlanId,
      updateUrl: subscription.updateUrl,
      cancelUrl: subscription.cancelUrl,
      status: subscription.status,
      nextBillAmount: subscription.nextBillAmount,
      nextBillDate: subscription.nextBillDate,
      lastBillDate: subscription.lastBillDate,
      createdAt: subscription.createdAt.getTime(),
      updatedAt: subscription.updatedAt.getTime(),
      cancellationEffectiveDate: subscription.cancellationEffectiveDate,
    };

    expect(subscriptionSerializer(subscription)).toEqual(expectedPayload);
  });
});
