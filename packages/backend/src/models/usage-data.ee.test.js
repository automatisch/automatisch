import { describe, it, expect } from 'vitest';
import UsageData from '@/models/usage-data.ee.js';
import User from '@/models/user.js';
import Subscription from '@/models/subscription.ee.js';
import Base from '@/models/base.js';
import { createUsageData } from '@/factories/usage-data.js';

describe('UsageData model', () => {
  it('tableName should return correct name', () => {
    expect(UsageData.tableName).toBe('usage_data');
  });

  it('jsonSchema should have correct validations', () => {
    expect(UsageData.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = UsageData.relationMappings();

    const expectedRelations = {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'usage_data.user_id',
          to: 'users.id',
        },
      },
      subscription: {
        relation: Base.BelongsToOneRelation,
        modelClass: Subscription,
        join: {
          from: 'usage_data.subscription_id',
          to: 'subscriptions.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  it('increaseConsumedTaskCountByOne should increase consumed task count by one', async () => {
    const usageData = await createUsageData({
      consumedTaskCount: 1234,
    });

    await usageData.increaseConsumedTaskCountByOne();
    const refetchedUsageData = await usageData.$query();

    expect(refetchedUsageData.consumedTaskCount).toStrictEqual(1235);
  });
});
