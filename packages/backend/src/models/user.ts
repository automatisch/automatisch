import { QueryContext, ModelOptions } from 'objection';
import Base from './base';
import Connection from './connection';
import Flow from './flow';
import Step from './step';
import Execution from './execution';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import PaymentPlan from './payment-plan.ee';
import UsageData from './usage-data.ee';

class User extends Base {
  id!: string;
  fullName!: string;
  email!: string;
  password!: string;
  role: string;
  resetPasswordToken: string;
  resetPasswordTokenSentAt: string;
  connections?: Connection[];
  flows?: Flow[];
  steps?: Step[];
  executions?: Execution[];
  paymentPlan?: PaymentPlan;
  usageData?: UsageData;

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['fullName', 'email', 'password'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      fullName: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },
      role: { type: 'string', enum: ['admin', 'user'] },
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
    paymentPlan: {
      relation: Base.HasOneRelation,
      modelClass: PaymentPlan,
      join: {
        from: 'payment_plans.user_id',
        to: 'users.id',
      },
    },
    usageData: {
      relation: Base.HasOneRelation,
      modelClass: UsageData,
      join: {
        from: 'usage_data.user_id',
        to: 'users.id',
      },
    },
  });

  login(password: string) {
    return bcrypt.compare(password, this.password);
  }

  async generateResetPasswordToken() {
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');
    const resetPasswordTokenSentAt = new Date().toISOString();

    await this.$query().patch({ resetPasswordToken, resetPasswordTokenSentAt });
  }

  async resetPassword(password: string) {
    return await this.$query().patch({
      resetPasswordToken: null,
      resetPasswordTokenSentAt: null,
      password,
    });
  }

  async isResetPasswordTokenValid() {
    if (!this.resetPasswordTokenSentAt) {
      return false;
    }

    const sentAt = new Date(this.resetPasswordTokenSentAt);
    const now = new Date();
    const fourHoursInMilliseconds = 1000 * 60 * 60 * 4;

    return now.getTime() - sentAt.getTime() < fourHoursInMilliseconds;
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
