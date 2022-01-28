import { QueryContext, ModelOptions } from 'objection';
import Base from './base';
import Connection from './connection';
import Flow from './flow';
import bcrypt from 'bcrypt';

class User extends Base {
  id!: number;
  email!: string;
  password!: string;
  connections?: [Connection];
  flows?: [Flow];

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['email', 'password'],

    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };

  static relationMappings = () => ({
    connections: {
      relation: Base.HasManyRelation,
      modelClass: Connection,
      join: {
        from: 'users.id',
        to: 'connections.user_id',
      },
    },
    flows: {
      relation: Base.HasManyRelation,
      modelClass: Flow,
      join: {
        from: 'users.id',
        to: 'flows.user_id',
      },
    },
  });

  login(password: string) {
    return bcrypt.compare(password, this.password);
  }

  async generateHash() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    await this.generateHash();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);

    if (this.password) {
      await this.generateHash();
    }
  }
}

export default User;
