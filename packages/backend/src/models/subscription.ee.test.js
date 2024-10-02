import { vi, describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import Subscription from './subscription.ee';
import User from './user';
import UsageData from './usage-data.ee';
import Base from './base';
import { createSubscription } from '../../test/factories/subscription';

describe('Subscription model', () => {
  it('tableName should return correct name', () => {
    expect(Subscription.tableName).toBe('subscriptions');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Subscription.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = Subscription.relationMappings();

    const expectedRelations = {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'subscription.user_id',
          to: 'users.id',
        },
      },
      usageData: {
        relation: Base.HasManyRelation,
        modelClass: UsageData,
        join: {
          from: 'subscriptions.id',
          to: 'usage_data.subscription_id',
        },
      },
      currentUsageData: {
        relation: Base.HasOneRelation,
        modelClass: UsageData,
        join: {
          from: 'subscriptions.id',
          to: 'usage_data.subscription_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  it('plan should return paddle plan data', async () => {
    const subscription = await createSubscription({
      paddlePlanId: '47384',
    });

    const expectedPaddlePlan = {
      limit: '10,000',
      name: '10k - monthly',
      price: '€20',
      productId: '47384',
      quota: 10000,
    };

    expect(subscription.plan).toStrictEqual(expectedPaddlePlan);
  });

  it('isCancelledAndValid should return true if deleted but cancellation effective date has not passed', async () => {
    const subscription = await createSubscription({
      status: 'deleted',
      cancellationEffectiveDate: DateTime.now().plus({ days: 2 }).toString(),
    });

    expect(subscription.isCancelledAndValid).toBe(true);
  });

  describe('isValid', () => {
    it('should return true if status is active', async () => {
      const subscription = await createSubscription({
        status: 'active',
      });

      expect(subscription.isValid).toBe(true);
    });

    it('should return true if status is past due', async () => {
      const subscription = await createSubscription({
        status: 'past_due',
      });

      expect(subscription.isValid).toBe(true);
    });

    it('should return true if subscription is cancelled and valid', async () => {
      const subscription = await createSubscription();
      vi.spyOn(subscription, 'isCancelledAndValid').mockReturnValue(false);

      expect(subscription.isValid).toBe(true);
    });

    it('should return false if any condition is matched', async () => {
      const subscription = await createSubscription({
        status: 'not_valid',
      });

      expect(subscription.isValid).toBe(false);
    });
  });
});
