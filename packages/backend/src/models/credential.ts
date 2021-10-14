import Base from './base'
import User from './user'

class Credential extends Base {
  id!: number
  displayName!: string
  key!: string
  data!: string
  userId!: number

  static tableName = 'credentials';

  static jsonSchema = {
    type: 'object',
    required: ['displayName', 'key', 'data', 'userId'],

    properties: {
      id: { type: 'integer' },
      displayName: { type: 'string', minLength: 1, maxLength: 255 },
      key: { type: 'string', minLength: 1, maxLength: 255 },
      data: { type: 'object' },
      userId: { type: 'integer' },
      verified: { type: 'boolean' },
    }
  }

  static relationMappings = () => ({
    credentials: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'credentials.user_id',
        to: 'users.id',
      },
    }
  })
}

export default Credential;
