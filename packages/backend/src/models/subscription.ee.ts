import Base from './base';
import User from './user';
import UsageData from './usage-data.ee';
import { getPlanById } from '../helpers/billing/plans.ee';

class Subscription extends Base {
  id!: string;
  userId!: string;
  paddleSubscriptionId!: string;
  paddlePlanId!: string;
  updateUrl!: string;
  cancelUrl!: string;
  status!: string;
  nextBillAmount!: string;
  nextBillDate!: string;
  lastBillDate?: string;
  usageData?: UsageData[];
  currentUsageData?: UsageData;

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
}

export default Subscription;
