import { QueryContext, ModelOptions } from 'objection';
import Base from './base';
import Connection from './connection';
import Flow from './flow';
import Step from './step';
import Execution from './execution';
import bcrypt from 'bcrypt';

class User extends Base {
  id!: string;
  email!: string;
  password!: string;
  connections?: Connection[];
  flows?: Flow[];
  steps?: Step[];
  executions?: Execution[];

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['email', 'password'],

    properties: {
      id: { type: 'string', format: 'uuid' },
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
    steps: {
      relation: Base.ManyToManyRelation,
      modelClass: Step,
      join: {
        from: 'users.id',
        through: {
          from: 'flows.user_id',
          to: 'flows.id',
        },
        to: 'steps.flow_id',
      },
    },
    executions: {
      relation: Base.ManyToManyRelation,
      modelClass: Execution,
      join: {
        from: 'users.id',
        through: {
          from: 'flows.user_id',
          to: 'flows.id',
        },
        to: 'executions.flow_id',
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
