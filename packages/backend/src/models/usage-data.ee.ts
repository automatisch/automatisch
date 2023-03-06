import Base from './base';
import User from './user';

class UsageData extends Base {
  id!: string;
  userId!: string;
  consumedTaskCount!: number;
  nextResetAt!: string;

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
  });
}

export default UsageData;
