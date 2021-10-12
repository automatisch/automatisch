import Base from './base'

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
}

export default Credential;
