import { raw } from 'objection';
import Base from './base';
import User from './user';
import Subscription from './subscription.ee';
import { getPlanById } from '../helpers/billing/plans.ee';

class UsageData extends Base {
  id!: string;
  userId!: string;
  subscriptionId?: string;
  consumedTaskCount!: number;
  nextResetAt!: string;
  subscription?: Subscription;

  static tableName = 'usage_data';

  static jsonSchema = {
    type: 'object',
    required: ['userId', 'consumedTaskCount', 'nextResetAt'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      subscriptionId: { type: 'string', format: 'uuid' },
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
    subscription: {
      relation: Base.BelongsToOneRelation,
      modelClass: Subscription,
      join: {
        from: 'usage_data.subscription_id',
        to: 'subscriptions.id',
      },
    },
  });

  async checkIfLimitExceeded() {
    const subscription = await this.$relatedQuery('subscription');

    const plan = subscription.plan;

    return this.consumedTaskCount >= plan.quota;
  }

  async increaseConsumedTaskCountByOne() {
    return await this.$query().patch({ consumedTaskCount: raw('consumed_task_count + 1') });
  }
}

export default UsageData;
