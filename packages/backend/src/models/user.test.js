import { describe, it, expect, vi } from 'vitest';
import Base from './base.js';
import AccessToken from './access-token.js';
import Connection from './connection.js';
import Execution from './execution.js';
import Flow from './flow.js';
import Identity from './identity.ee.js';
import Permission from './permission.js';
import Role from './role.js';
import Step from './step.js';
import Subscription from './subscription.ee.js';
import UsageData from './usage-data.ee.js';
import User from './user.js';

describe('User model', () => {
  it('tableName should return correct name', () => {
    expect(User.tableName).toBe('users');
  });

  it('jsonSchema should have correct validations', () => {
    expect(User.jsonSchema).toMatchSnapshot();
  });

  describe('relationMappings', () => {
    it('should return correct associations', () => {
      const relationMappings = User.relationMappings();

      const expectedRelations = {
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
          filter: expect.any(Function),
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
          filter: expect.any(Function),
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
      };

      expect(relationMappings).toStrictEqual(expectedRelations);
    });

    it('currentUsageData should return the current usage data', () => {
      const relations = User.relationMappings();

      const firstSpy = vi.fn();

      const limitSpy = vi.fn().mockImplementation(() => ({
        first: firstSpy,
      }));

      const orderBySpy = vi.fn().mockImplementation(() => ({
        limit: limitSpy,
      }));

      relations.currentUsageData.filter({ orderBy: orderBySpy });

      expect(orderBySpy).toHaveBeenCalledWith('created_at', 'desc');
      expect(limitSpy).toHaveBeenCalledWith(1);
      expect(firstSpy).toHaveBeenCalledOnce();
    });

    it('currentSubscription should return the current subscription', () => {
      const relations = User.relationMappings();

      const firstSpy = vi.fn();

      const limitSpy = vi.fn().mockImplementation(() => ({
        first: firstSpy,
      }));

      const orderBySpy = vi.fn().mockImplementation(() => ({
        limit: limitSpy,
      }));

      relations.currentSubscription.filter({ orderBy: orderBySpy });

      expect(orderBySpy).toHaveBeenCalledWith('created_at', 'desc');
      expect(limitSpy).toHaveBeenCalledWith(1);
      expect(firstSpy).toHaveBeenCalledOnce();
    });
  });

  it('virtualAttributes should return correct attributes', () => {
    const virtualAttributes = User.virtualAttributes;

    const expectedAttributes = ['acceptInvitationUrl'];

    expect(virtualAttributes).toStrictEqual(expectedAttributes);
  });
});
