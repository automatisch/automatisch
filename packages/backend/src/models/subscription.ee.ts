import Base from './base';
import User from './user';

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
  });
}

export default Subscription;
