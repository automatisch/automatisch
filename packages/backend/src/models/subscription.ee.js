import Base from '@/models/base.js';
import User from '@/models/user.js';
import UsageData from '@/models/usage-data.ee.js';
import { DateTime } from 'luxon';
import { getPlanById } from '@/helpers/billing/plans.ee.js';

class Subscription extends Base {
  static tableName = 'subscriptions';

  static jsonSchema = {
    type: 'object',
    required: [
      'userId',
      'paddleSubscriptionId',
      'paddlePlanId',
      'updateUrl',
      'cancelUrl',
      'status',
      'nextBillAmount',
      'nextBillDate',
    ],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      paddleSubscriptionId: { type: 'string' },
      paddlePlanId: { type: 'string' },
      updateUrl: { type: 'string' },
      cancelUrl: { type: 'string' },
      status: { type: 'string' },
      nextBillAmount: { type: 'string' },
      nextBillDate: { type: 'string' },
      lastBillDate: { type: 'string' },
      cancellationEffectiveDate: { type: 'string' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
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
  });

  get plan() {
    return getPlanById(this.paddlePlanId);
  }

  get isCancelledAndValid() {
    return (
      this.status === 'deleted' &&
      Number(this.cancellationEffectiveDate) >
      DateTime.now().startOf('day').toMillis()
    );
  }

  get isValid() {
    if (this.status === 'active') return true;
    if (this.status === 'past_due') return true;
    if (this.isCancelledAndValid) return true;

    return false;
  }
}

export default Subscription;
