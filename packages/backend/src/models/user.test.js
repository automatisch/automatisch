import { describe, it, expect, vi } from 'vitest';
import appConfig from '../config/app.js';
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
import { createUser } from '../../test/factories/user.js';
import { createConnection } from '../../test/factories/connection.js';
import { createRole } from '../../test/factories/role.js';
import { createPermission } from '../../test/factories/permission.js';
import { createFlow } from '../../test/factories/flow.js';
import { createStep } from '../../test/factories/step.js';
import { createExecution } from '../../test/factories/execution.js';

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

  it('acceptInvitationUrl should return accept invitation page URL with invitation token', async () => {
    const user = new User();
    user.invitationToken = 'invitation-token';

    vi.spyOn(appConfig, 'webAppUrl', 'get').mockReturnValue(
      'https://automatisch.io'
    );

    expect(user.acceptInvitationUrl).toBe(
      'https://automatisch.io/accept-invitation?token=invitation-token'
    );
  });

  describe('authenticate', () => {
    it('should create and return the token for correct email and password', async () => {
      const user = await createUser({
        email: 'test-user@automatisch.io',
        password: 'sample-password',
      });

      const token = await User.authenticate(
        'test-user@automatisch.io',
        'sample-password'
      );

      const persistedToken = await AccessToken.query().findOne({
        userId: user.id,
      });

      expect(token).toBe(persistedToken.token);
    });

    it('should return undefined for existing email and incorrect password', async () => {
      await createUser({
        email: 'test-user@automatisch.io',
        password: 'sample-password',
      });

      const token = await User.authenticate(
        'test-user@automatisch.io',
        'wrong-password'
      );

      expect(token).toBe(undefined);
    });

    it('should return undefined for non-existing email', async () => {
      await createUser({
        email: 'test-user@automatisch.io',
        password: 'sample-password',
      });

      const token = await User.authenticate('non-existing-user@automatisch.io');

      expect(token).toBe(undefined);
    });
  });

  describe('authorizedFlows', () => {
    it('should return user flows with isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Flow',
        action: 'read',
        conditions: ['isCreator'],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userFlow = await createFlow({ userId: user.id });
      await createFlow();

      expect(await userWithRoleAndPermissions.authorizedFlows).toStrictEqual([
        userFlow,
      ]);
    });

    it('should return all flows without isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Flow',
        action: 'read',
        conditions: [],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userFlow = await createFlow({ userId: user.id });
      const anotherUserFlow = await createFlow();

      expect(await userWithRoleAndPermissions.authorizedFlows).toStrictEqual([
        userFlow,
        anotherUserFlow,
      ]);
    });

    it('should throw an authorization error without Flow read permission', async () => {
      const user = new User();

      expect(() => user.authorizedFlows).toThrowError(
        'The user is not authorized!'
      );
    });
  });

  describe('authorizedSteps', () => {
    it('should return user steps with isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Flow',
        action: 'read',
        conditions: ['isCreator'],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userFlow = await createFlow({ userId: user.id });
      const userFlowStep = await createStep({ flowId: userFlow.id });
      const anotherUserFlow = await createFlow();
      await createStep({ flowId: anotherUserFlow.id });

      expect(await userWithRoleAndPermissions.authorizedSteps).toStrictEqual([
        userFlowStep,
      ]);
    });

    it('should return all steps without isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Flow',
        action: 'read',
        conditions: [],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userFlow = await createFlow({ userId: user.id });
      const userFlowStep = await createStep({ flowId: userFlow.id });
      const anotherUserFlow = await createFlow();
      const anotherUserFlowStep = await createStep({
        flowId: anotherUserFlow.id,
      });

      expect(await userWithRoleAndPermissions.authorizedSteps).toStrictEqual([
        userFlowStep,
        anotherUserFlowStep,
      ]);
    });

    it('should throw an authorization error without Flow read permission', async () => {
      const user = new User();

      expect(() => user.authorizedSteps).toThrowError(
        'The user is not authorized!'
      );
    });
  });

  describe('authorizedConnections', () => {
    it('should return user connections with isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Connection',
        action: 'read',
        conditions: ['isCreator'],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userConnection = await createConnection({ userId: user.id });
      await createConnection();

      expect(
        await userWithRoleAndPermissions.authorizedConnections
      ).toStrictEqual([userConnection]);
    });

    it('should return all connections without isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Connection',
        action: 'read',
        conditions: [],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userConnection = await createConnection({ userId: user.id });
      const anotherUserConnection = await createConnection();

      expect(
        await userWithRoleAndPermissions.authorizedConnections
      ).toStrictEqual([userConnection, anotherUserConnection]);
    });

    it('should throw an authorization error without Connection read permission', async () => {
      const user = new User();

      expect(() => user.authorizedConnections).toThrowError(
        'The user is not authorized!'
      );
    });
  });

  describe('authorizedExecutions', () => {
    it('should return user executions with isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Execution',
        action: 'read',
        conditions: ['isCreator'],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userFlow = await createFlow({ userId: user.id });
      const userFlowExecution = await createExecution({ flowId: userFlow.id });
      await createExecution();

      expect(
        await userWithRoleAndPermissions.authorizedExecutions
      ).toStrictEqual([userFlowExecution]);
    });

    it('should return all executions without isCreator condition', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Execution',
        action: 'read',
        conditions: [],
      });

      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      const userFlow = await createFlow({ userId: user.id });
      const userFlowExecution = await createExecution({ flowId: userFlow.id });
      const anotherUserFlowExecution = await createExecution();

      expect(
        await userWithRoleAndPermissions.authorizedExecutions
      ).toStrictEqual([userFlowExecution, anotherUserFlowExecution]);
    });

    it('should throw an authorization error without Execution read permission', async () => {
      const user = new User();

      expect(() => user.authorizedExecutions).toThrowError(
        'The user is not authorized!'
      );
    });
  });

  describe('login', () => {
    it('should return true when the given password matches with the user password', async () => {
      const user = await createUser({ password: 'sample-password' });

      expect(await user.login('sample-password')).toBe(true);
    });

    it('should return false when the given password does not match with the user password', async () => {
      const user = await createUser({ password: 'sample-password' });

      expect(await user.login('wrong-password')).toBe(false);
    });
  });
});
