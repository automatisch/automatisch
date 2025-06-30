import crypto from 'node:crypto';
import { QueryContext, ModelOptions } from 'objection';
import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { PureAbility, fieldPatternMatcher, mongoQueryMatcher } from '@casl/ability';
import type { Subject } from '@casl/ability';

import appConfig from '../config/app';
import Base from './base';
import ExtendedQueryBuilder from './query-builder';
import Connection from './connection';
import Flow from './flow';
import Step from './step';
import Role from './role';
import Permission from './permission';
import Execution from './execution';
import Identity from './identity.ee';
import UsageData from './usage-data.ee';
import Subscription from './subscription.ee';

class User extends Base {
  id!: string;
  fullName!: string;
  email!: string;
  roleId: string;
  password!: string;
  resetPasswordToken: string;
  resetPasswordTokenSentAt: string;
  trialExpiryDate: string;
  connections?: Connection[];
  flows?: Flow[];
  steps?: Step[];
  executions?: Execution[];
  usageData?: UsageData[];
  currentUsageData?: UsageData;
  subscriptions?: Subscription[];
  currentSubscription?: Subscription;
  role: Role;
  permissions: Permission[];
  identities: Identity[];

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['fullName', 'email'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      fullName: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email', minLength: 1, maxLength: 255 },
      password: { type: 'string' },
      resetPasswordToken: { type: 'string' },
      resetPasswordTokenSentAt: { type: 'string' },
      trialExpiryDate: { type: 'string' },
      roleId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
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
    usageData: {
      relation: Base.HasManyRelation,
      modelClass: UsageData,
      join: {
        from: 'usage_data.user_id',
        to: 'users.id',
      },
    },
    currentUsageData: {
      relation: Base.HasOneRelation,
      modelClass: UsageData,
      join: {
        from: 'usage_data.user_id',
        to: 'users.id',
      },
      filter(builder: ExtendedQueryBuilder<UsageData>) {
        builder.orderBy('created_at', 'desc').limit(1).first();
      },
    },
    subscriptions: {
      relation: Base.HasManyRelation,
      modelClass: Subscription,
      join: {
        from: 'subscriptions.user_id',
        to: 'users.id',
      },
    },
    currentSubscription: {
      relation: Base.HasOneRelation,
      modelClass: Subscription,
      join: {
        from: 'subscriptions.user_id',
        to: 'users.id',
      },
      filter(builder: ExtendedQueryBuilder<Subscription>) {
        builder.orderBy('created_at', 'desc').limit(1).first();
      },
    },
    role: {
      relation: Base.HasOneRelation,
      modelClass: Role,
      join: {
        from: 'roles.id',
        to: 'users.role_id',
      },
    },
    permissions: {
      relation: Base.ManyToManyRelation,
      modelClass: Permission,
      join: {
        from: 'users.role_id',
        through: {
          from: 'roles_permissions.role_id',
          to: 'roles_permissions.permission_id',
        },
        to: 'permissions.id',
      },
    },
    identities: {
      relation: Base.HasManyRelation,
      modelClass: Identity,
      join: {
        from: 'identities.user_id',
        to: 'users.id',
      }
    }
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
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async startTrialPeriod() {
    this.trialExpiryDate = DateTime.now().plus({ days: 30 }).toISODate();
  }

  async isAllowedToRunFlows() {
    if (appConfig.isSelfHosted) {
      return true;
    }

    if (await this.inTrial()) {
      return true;
    }

    if ((await this.hasActiveSubscription()) && (await this.withinLimits())) {
      return true;
    }

    return false;
  }

  async inTrial() {
    if (appConfig.isSelfHosted) {
      return false;
    }

    if (!this.trialExpiryDate) {
      return false;
    }

    if (await this.hasActiveSubscription()) {
      return false;
    }

    const expiryDate = DateTime.fromJSDate(
      this.trialExpiryDate as unknown as Date
    );
    const now = DateTime.now();

    return now < expiryDate;
  }

  async hasActiveSubscription() {
    if (!appConfig.isCloud) {
      return false;
    }

    const subscription = await this.$relatedQuery('currentSubscription');

    return subscription?.isValid;
  }

  async withinLimits() {
    const currentSubscription = await this.$relatedQuery('currentSubscription');
    const plan = currentSubscription.plan;
    const currentUsageData = await this.$relatedQuery('currentUsageData');

    return currentUsageData.consumedTaskCount < plan.quota;
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    await this.generateHash();

    if (appConfig.isCloud) {
      await this.startTrialPeriod();
    }
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);

    await this.generateHash();
  }

  async $afterInsert(queryContext: QueryContext) {
    await super.$afterInsert(queryContext);

    if (appConfig.isCloud) {
      await this.$relatedQuery('usageData').insert({
        userId: this.id,
        consumedTaskCount: 0,
        nextResetAt: DateTime.now().plus({ days: 30 }).toISODate(),
      });
    }
  }

  get ability() {
    if (!this.permissions) {
      throw new Error('User.permissions must be fetched!');
    }

    // We're not using mongo, but our fields, conditions match
    return new PureAbility(this.permissions, {
      conditionsMatcher: mongoQueryMatcher,
      fieldMatcher: fieldPatternMatcher
    });
  }

  can(action: string, subject: Subject) {
    const can = this.ability.can(action, subject);

    if (!can) throw new Error('Not authorized!');

    return can;
  }

  cannot(action: string, subject: Subject) {
    const cannot = this.ability.cannot(action, subject);

    if (cannot) throw new Error('Not authorized!');

    return cannot;
  }
}

export default User;
