import { QueryContext, ModelOptions } from 'objection';
import Base from './base';
import Credential from './credential';
import bcrypt from 'bcrypt';

class User extends Base {
  id!: number
  email!: string
  password!: string

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['email', 'password'],

    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },
    }
  }

  static relationMappings = () => ({
    credentials: {
      relation: Base.HasManyRelation,
      modelClass: Credential,
      join: {
        from: 'users.id',
        to: 'credentials.user_id',
      },
    }
  })

  async generateHash() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    await this.generateHash()
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);

    if(this.password) {
      await this.generateHash()
    }
  }
}

export default User;
