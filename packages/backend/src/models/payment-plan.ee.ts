import Base from './base';
import User from './user';

class PaymentPlan extends Base {
  id!: string;
  name!: string;
  taskCount: number;
  userId!: string;
  stripeCustomerId!: string;
  stripeSubscriptionId!: string;
  currentPeriodStartedAt!: string;
  currentPeriodEndsAt!: string;

  static tableName = 'payment_plans';

  static jsonSchema = {
    type: 'object',
    required: [
      'name',
      'taskCount',
      'userId',
      'stripeCustomerId',
      'stripeSubscriptionId',
      'currentPeriodStartedAt',
      'currentPeriodEndsAt',
    ],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      taskCount: { type: 'integer' },
      userId: { type: 'string', format: 'uuid' },
      stripeCustomerId: { type: 'string' },
      stripeSubscriptionId: { type: 'string' },
      currentPeriodStartedAt: { type: 'string' },
      currentPeriodEndsAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'payment_plans.user_id',
        to: 'users.id',
      },
    },
  });
}

export default PaymentPlan;
