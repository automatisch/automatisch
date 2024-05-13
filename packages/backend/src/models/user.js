import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import crypto from 'node:crypto';

import appConfig from '../config/app.js';
import { hasValidLicense } from '../helpers/license.ee.js';
import userAbility from '../helpers/user-ability.js';
import createAuthTokenByUserId from '../helpers/create-auth-token-by-user-id.js';
import Base from './base.js';
import App from './app.js';
import AccessToken from './access-token.js';
import Connection from './connection.js';
import Config from './config.js';
import Execution from './execution.js';
import Flow from './flow.js';
import Identity from './identity.ee.js';
import Permission from './permission.js';
import Role from './role.js';
import Step from './step.js';
import Subscription from './subscription.ee.js';
import UsageData from './usage-data.ee.js';
import Billing from '../helpers/billing/index.ee.js';

class User extends Base {
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
    accessTokens: {
      relation: Base.HasManyRelation,
      modelClass: AccessToken,
      join: {
        from: 'users.id',
        to: 'access_tokens.user_id',
      },
    },
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
      filter(builder) {
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
      filter(builder) {
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
      relation: Base.HasManyRelation,
      modelClass: Permission,
      join: {
        from: 'users.role_id',
        to: 'permissions.role_id',
      },
    },
    identities: {
      relation: Base.HasManyRelation,
      modelClass: Identity,
      join: {
        from: 'identities.user_id',
        to: 'users.id',
      },
    },
  });

  get authorizedFlows() {
    const conditions = this.can('read', 'Flow');
    return conditions.isCreator ? this.$relatedQuery('flows') : Flow.query();
  }

  get authorizedSteps() {
    const conditions = this.can('read', 'Flow');
    return conditions.isCreator ? this.$relatedQuery('steps') : Step.query();
  }

  get authorizedConnections() {
    const conditions = this.can('read', 'Connection');
    return conditions.isCreator
      ? this.$relatedQuery('connections')
      : Connection.query();
  }

  get authorizedExecutions() {
    const conditions = this.can('read', 'Execution');
    return conditions.isCreator
      ? this.$relatedQuery('executions')
      : Execution.query();
  }

  static async authenticate(email, password) {
    const user = await User.query().findOne({
      email: email?.toLowerCase() || null,
    });

    if (user && (await user.login(password))) {
      const token = await createAuthTokenByUserId(user.id);
      return token;
    }
  }

  login(password) {
    return bcrypt.compare(password, this.password);
  }

  async generateResetPasswordToken() {
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');
    const resetPasswordTokenSentAt = new Date().toISOString();

    await this.$query().patch({ resetPasswordToken, resetPasswordTokenSentAt });
  }

  async resetPassword(password) {
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

    const expiryDate = DateTime.fromJSDate(this.trialExpiryDate);
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

  async getPlanAndUsage() {
    const usageData = await this.$relatedQuery(
      'currentUsageData'
    ).throwIfNotFound();

    const subscription = await this.$relatedQuery('currentSubscription');

    const currentPlan = Billing.paddlePlans.find(
      (plan) => plan.productId === subscription?.paddlePlanId
    );

    const planAndUsage = {
      usage: {
        task: usageData.consumedTaskCount,
      },
      plan: {
        id: subscription?.paddlePlanId || null,
        name: subscription ? currentPlan.name : 'Free Trial',
        limit: currentPlan?.limit || null,
      },
    };

    return planAndUsage;
  }

  async getInvoices() {
    const subscription = await this.$relatedQuery('currentSubscription');

    if (!subscription) {
      return [];
    }

    const invoices = await Billing.paddleClient.getInvoices(
      Number(subscription.paddleSubscriptionId)
    );

    return invoices;
  }

  async getApps(name) {
    const connections = await this.authorizedConnections
      .clone()
      .select('connections.key')
      .where({ draft: false })
      .count('connections.id as count')
      .groupBy('connections.key');

    const flows = await this.authorizedFlows
      .clone()
      .withGraphJoined('steps')
      .orderBy('created_at', 'desc');

    const duplicatedUsedApps = flows
      .map((flow) => flow.steps.map((step) => step.appKey))
      .flat()
      .filter(Boolean);

    const connectionKeys = connections.map((connection) => connection.key);
    const usedApps = [...new Set([...duplicatedUsedApps, ...connectionKeys])];

    let apps = await App.findAll(name);

    apps = apps
      .filter((app) => {
        return usedApps.includes(app.key);
      })
      .map((app) => {
        const connection = connections.find(
          (connection) => connection.key === app.key
        );

        app.connectionCount = connection?.count || 0;
        app.flowCount = 0;

        flows.forEach((flow) => {
          const usedFlow = flow.steps.find((step) => step.appKey === app.key);

          if (usedFlow) {
            app.flowCount += 1;
          }
        });

        return app;
      })
      .sort((appA, appB) => appA.name.localeCompare(appB.name));

    return apps;
  }

  static async createAdmin({ email, password, fullName }) {
    const adminRole = await Role.findAdmin();

    const adminUser = await this.query().insert({
      email,
      password,
      fullName,
      roleId: adminRole.id
    });

    await Config.markInstallationCompleted();

    return adminUser;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    this.email = this.email.toLowerCase();
    await this.generateHash();

    if (appConfig.isCloud) {
      await this.startTrialPeriod();
    }
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    if (this.email) {
      this.email = this.email.toLowerCase();
    }

    await this.generateHash();
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);

    if (appConfig.isCloud) {
      await this.$relatedQuery('usageData').insert({
        userId: this.id,
        consumedTaskCount: 0,
        nextResetAt: DateTime.now().plus({ days: 30 }).toISODate(),
      });
    }
  }

  async $afterFind() {
    if (await hasValidLicense()) return this;

    if (Array.isArray(this.permissions)) {
      this.permissions = this.permissions.filter((permission) => {
        const restrictedSubjects = [
          'App',
          'Role',
          'SamlAuthProvider',
          'Config',
        ];

        return !restrictedSubjects.includes(permission.subject);
      });
    }

    return this;
  }

  get ability() {
    return userAbility(this);
  }

  can(action, subject) {
    const can = this.ability.can(action, subject);

    if (!can) throw new Error('Not authorized!');

    const relevantRule = this.ability.relevantRuleFor(action, subject);

    const conditions = relevantRule?.conditions || [];
    const conditionMap = Object.fromEntries(
      conditions.map((condition) => [condition, true])
    );

    return conditionMap;
  }

  cannot(action, subject) {
    const cannot = this.ability.cannot(action, subject);

    if (cannot) throw new Error('Not authorized!');

    return cannot;
  }
}

export default User;
