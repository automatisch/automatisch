import { raw } from 'objection';
import Base from './base';
import User from './user';
import PaymentPlan from './payment-plan.ee';

class UsageData extends Base {
  id!: string;
  userId!: string;
  consumedTaskCount!: number;
  nextResetAt!: string;
  paymentPlan?: PaymentPlan;

  static tableName = 'usage_data';

  static jsonSchema = {
    type: 'object',
    required: ['userId', 'consumedTaskCount', 'nextResetAt'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      consumedTaskCount: { type: 'integer' },
      nextResetAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'usage_data.user_id',
        to: 'users.id',
      },
    },
    paymentPlan: {
      relation: Base.BelongsToOneRelation,
      modelClass: PaymentPlan,
      join: {
        from: 'usage_data.user_id',
        to: 'payment_plans.user_id',
      },
    },
  });

  async checkIfLimitExceeded() {
    const paymentPlan = await this.$relatedQuery('paymentPlan');

    return this.consumedTaskCount >= paymentPlan.taskCount;
  }

  async increaseConsumedTaskCountByOne() {
    return await this.$query().patch({ consumedTaskCount: raw('consumed_task_count + 1') });
  }
}

export default UsageData;
