import { beforeEach, describe, it, expect, vi } from 'vitest';
import { DateTime, Duration } from 'luxon';
import Crypto from 'crypto';
import appConfig from '../config/app.js';
import * as licenseModule from '../helpers/license.ee.js';
import Base from './base.js';
import AccessToken from './access-token.js';
import Config from './config.js';
import Connection from './connection.js';
import Execution from './execution.js';
import Flow from './flow.js';
import Identity from './identity.ee.js';
import Permission from './permission.js';
import Role from './role.js';
import Step from './step.js';
import Subscription from './subscription.ee.js';
import UsageData from './usage-data.ee.js';
import Folder from './folder.js';
import User from './user.js';
import deleteUserQueue from '../queues/delete-user.ee.js';
import emailQueue from '../queues/email.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '../helpers/remove-job-configuration.js';
import * as userAbilityModule from '../helpers/user-ability.js';
import { createUser } from '../../test/factories/user.js';
import { createConnection } from '../../test/factories/connection.js';
import { createRole } from '../../test/factories/role.js';
import { createPermission } from '../../test/factories/permission.js';
import { createFlow } from '../../test/factories/flow.js';
import { createStep } from '../../test/factories/step.js';
import { createExecution } from '../../test/factories/execution.js';
import { createSubscription } from '../../test/factories/subscription.js';
import { createUsageData } from '../../test/factories/usage-data.js';
import { createFolder } from '../../test/factories/folder.js';
import { createTemplate } from '../../test/factories/template.js';
import Billing from '../helpers/billing/index.ee.js';
import Template from './template.ee.js';

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
        folders: {
          relation: Base.HasManyRelation,
          modelClass: Folder,
          join: {
            from: 'users.id',
            to: 'folders.user_id',
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
        await userWithRoleAndPermissions.authorizedConnections.orderBy(
          'created_at',
          'asc'
        )
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

  it('ability should return userAbility for the user', () => {
    const user = new User();
    user.fullName = 'Sample user';

    const userAbilitySpy = vi
      .spyOn(userAbilityModule, 'default')
      .mockReturnValue('user-ability');

    expect(user.ability).toStrictEqual('user-ability');
    expect(userAbilitySpy).toHaveBeenNthCalledWith(1, user);
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

  it('generateResetPasswordToken should persist a random reset password token with the current date', async () => {
    vi.useFakeTimers();

    const date = new Date(2024, 10, 11, 15, 17, 0, 0);
    vi.setSystemTime(date);

    const user = await createUser({
      resetPasswordToken: null,
      resetPasswordTokenSentAt: null,
    });

    await user.generateResetPasswordToken();

    const refetchedUser = await user.$query();

    expect(refetchedUser.resetPasswordToken.length).toBe(128);
    expect(refetchedUser.resetPasswordTokenSentAt).toStrictEqual(date);

    vi.useRealTimers();
  });

  it('generateInvitationToken should persist a random invitation token with the current date', async () => {
    vi.useFakeTimers();

    const date = new Date(2024, 10, 11, 15, 26, 0, 0);
    vi.setSystemTime(date);

    const user = await createUser({
      invitationToken: null,
      invitationTokenSentAt: null,
    });

    await user.generateInvitationToken();

    const refetchedUser = await user.$query();

    expect(refetchedUser.invitationToken.length).toBe(128);
    expect(refetchedUser.invitationTokenSentAt).toStrictEqual(date);

    vi.useRealTimers();
  });

  it('resetPassword should persist given password and remove reset password token', async () => {
    const user = await createUser({
      resetPasswordToken: 'reset-password-token',
      resetPasswordTokenSentAt: '2024-11-11T12:26:00.000Z',
    });

    await user.resetPassword('new-password');

    const refetchedUser = await user.$query();

    expect(refetchedUser.resetPasswordToken).toBe(null);
    expect(refetchedUser.resetPasswordTokenSentAt).toBe(null);
    expect(await refetchedUser.login('new-password')).toBe(true);
  });

  it('acceptInvitation should persist given password, set user active and remove invitation token', async () => {
    const user = await createUser({
      invitationToken: 'invitation-token',
      invitationTokenSentAt: '2024-11-11T12:26:00.000Z',
      status: 'invited',
    });

    await user.acceptInvitation('new-password');

    const refetchedUser = await user.$query();

    expect(refetchedUser.invitationToken).toBe(null);
    expect(refetchedUser.invitationTokenSentAt).toBe(null);
    expect(refetchedUser.status).toBe('active');
  });

  describe('updatePassword', () => {
    it('should update password when the given current password matches with the user password', async () => {
      const user = await createUser({ password: 'sample-password' });

      const updatedUser = await user.updatePassword({
        currentPassword: 'sample-password',
        password: 'new-password',
      });

      expect(await updatedUser.login('new-password')).toBe(true);
    });

    it('should throw validation error when the given current password does not match with the user password', async () => {
      const user = await createUser({ password: 'sample-password' });

      await expect(
        user.updatePassword({
          currentPassword: 'wrong-password',
          password: 'new-password',
        })
      ).rejects.toThrowError('currentPassword: is incorrect.');
    });
  });

  it('softRemove should soft remove the user, its associations and queue it for hard deletion in 30 days', async () => {
    vi.useFakeTimers();

    const date = new Date(2024, 10, 12, 12, 50, 0, 0);
    vi.setSystemTime(date);

    const user = await createUser();

    const softRemoveAssociationsSpy = vi
      .spyOn(user, 'softRemoveAssociations')
      .mockReturnValue();

    const deleteUserQueueAddSpy = vi
      .spyOn(deleteUserQueue, 'add')
      .mockResolvedValue();

    await user.softRemove();

    const refetchedSoftDeletedUser = await user.$query().withSoftDeleted();

    const millisecondsFor30Days = Duration.fromObject({ days: 30 }).toMillis();
    const jobName = `Delete user - ${user.id}`;
    const jobPayload = { id: user.id };

    const jobOptions = {
      delay: millisecondsFor30Days,
    };

    expect(softRemoveAssociationsSpy).toHaveBeenCalledOnce();
    expect(refetchedSoftDeletedUser.deletedAt).toStrictEqual(date);

    expect(deleteUserQueueAddSpy).toHaveBeenCalledWith(
      jobName,
      jobPayload,
      jobOptions
    );

    vi.useRealTimers();
  });

  it.todo('softRemoveAssociations');

  it('sendResetPasswordEmail should generate reset password token and queue to send reset password email', async () => {
    vi.useFakeTimers();

    const date = new Date(2024, 10, 12, 14, 33, 0, 0);
    vi.setSystemTime(date);

    const user = await createUser();

    const generateResetPasswordTokenSpy = vi
      .spyOn(user, 'generateResetPasswordToken')
      .mockReturnValue();

    const emailQueueAddSpy = vi.spyOn(emailQueue, 'add').mockResolvedValue();

    await user.sendResetPasswordEmail();

    const refetchedUser = await user.$query();
    const jobName = `Reset Password Email - ${user.id}`;

    const jobPayload = {
      email: refetchedUser.email,
      subject: 'Reset Password',
      template: 'reset-password-instructions.ee',
      params: {
        token: refetchedUser.resetPasswordToken,
        webAppUrl: appConfig.webAppUrl,
        fullName: refetchedUser.fullName,
      },
    };

    const jobOptions = {
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    };

    expect(generateResetPasswordTokenSpy).toHaveBeenCalledOnce();

    expect(emailQueueAddSpy).toHaveBeenCalledWith(
      jobName,
      jobPayload,
      jobOptions
    );

    vi.useRealTimers();
  });

  describe('isResetPasswordTokenValid', () => {
    it('should return true when resetPasswordTokenSentAt is within the next four hours', async () => {
      vi.useFakeTimers();

      const date = DateTime.fromObject(
        { year: 2024, month: 11, day: 12, hour: 16, minute: 30 },
        { zone: 'UTC+0' }
      );

      vi.setSystemTime(date);

      const user = new User();
      user.resetPasswordTokenSentAt = '2024-11-12T13:31:00.000Z';

      expect(user.isResetPasswordTokenValid()).toBe(true);

      vi.useRealTimers();
    });

    it('should return false when there is no resetPasswordTokenSentAt', async () => {
      const user = new User();

      expect(user.isResetPasswordTokenValid()).toBe(false);
    });

    it('should return false when resetPasswordTokenSentAt is older than four hours', async () => {
      vi.useFakeTimers();

      const date = DateTime.fromObject(
        { year: 2024, month: 11, day: 12, hour: 16, minute: 30 },
        { zone: 'UTC+0' }
      );

      vi.setSystemTime(date);

      const user = new User();
      user.resetPasswordTokenSentAt = '2024-11-12T12:29:00.000Z';

      expect(user.isResetPasswordTokenValid()).toBe(false);

      vi.useRealTimers();
    });
  });

  it('sendInvitationEmail should generate invitation token and queue to send invitation email', async () => {
    vi.useFakeTimers();

    const date = DateTime.fromObject(
      { year: 2024, month: 11, day: 12, hour: 17, minute: 10 },
      { zone: 'UTC+0' }
    );

    vi.setSystemTime(date);

    const user = await createUser();

    const generateInvitationTokenSpy = vi
      .spyOn(user, 'generateInvitationToken')
      .mockReturnValue();

    const emailQueueAddSpy = vi.spyOn(emailQueue, 'add').mockResolvedValue();

    await user.sendInvitationEmail();

    const refetchedUser = await user.$query();
    const jobName = `Invitation Email - ${refetchedUser.id}`;

    const jobPayload = {
      email: refetchedUser.email,
      subject: 'You are invited!',
      template: 'invitation-instructions',
      params: {
        fullName: refetchedUser.fullName,
        acceptInvitationUrl: refetchedUser.acceptInvitationUrl,
      },
    };

    const jobOptions = {
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    };

    expect(generateInvitationTokenSpy).toHaveBeenCalledOnce();

    expect(emailQueueAddSpy).toHaveBeenCalledWith(
      jobName,
      jobPayload,
      jobOptions
    );

    vi.useRealTimers();
  });

  describe('isInvitationTokenValid', () => {
    it('should return truen when invitationTokenSentAt is within the next four hours', async () => {
      vi.useFakeTimers();

      const date = DateTime.fromObject(
        { year: 2024, month: 11, day: 14, hour: 14, minute: 30 },
        { zone: 'UTC+0' }
      );

      vi.setSystemTime(date);

      const user = new User();
      user.invitationTokenSentAt = '2024-11-14T13:31:00.000Z';

      expect(user.isInvitationTokenValid()).toBe(true);

      vi.useRealTimers();
    });

    it('should return false when there is no invitationTokenSentAt', async () => {
      const user = new User();

      expect(user.isInvitationTokenValid()).toBe(false);
    });

    it('should return false when invitationTokenSentAt is older than seventy two hours', async () => {
      vi.useFakeTimers();

      const date = DateTime.fromObject(
        { year: 2024, month: 11, day: 14, hour: 14, minute: 30 },
        { zone: 'UTC+0' }
      );

      vi.setSystemTime(date);

      const user = new User();
      user.invitationTokenSentAt = '2024-11-11T14:20:00.000Z';

      expect(user.isInvitationTokenValid()).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('generateHash', () => {
    it('should hash password and re-assign it', async () => {
      const user = new User();
      user.password = 'sample-password';

      await user.generateHash();

      expect(user.password).not.toBe('sample-password');
      expect(await user.login('sample-password')).toBe(true);
    });

    it('should do nothing when password does not exist', async () => {
      const user = new User();

      await user.generateHash();

      expect(user.password).toBe(undefined);
    });
  });

  it('startTrialPeriod should assign trialExpiryDate 30 days from now', () => {
    vi.useFakeTimers();

    const date = DateTime.fromObject(
      { year: 2024, month: 11, day: 14, hour: 16 },
      { zone: 'UTC+0' }
    );

    vi.setSystemTime(date);

    const user = new User();

    user.startTrialPeriod();

    expect(user.trialExpiryDate).toBe('2024-12-14');

    vi.useRealTimers();
  });

  describe('isAllowedToRunFlows', () => {
    it('should return true when Automatisch is self hosted', async () => {
      const user = new User();

      vi.spyOn(appConfig, 'isSelfHosted', 'get').mockReturnValue(true);

      expect(await user.isAllowedToRunFlows()).toBe(true);
    });

    it('should return true when the user is in trial', async () => {
      const user = new User();

      vi.spyOn(user, 'inTrial').mockResolvedValue(true);

      expect(await user.isAllowedToRunFlows()).toBe(true);
    });

    it('should return true when the user has active subscription and within quota limits', async () => {
      const user = new User();

      vi.spyOn(user, 'hasActiveSubscription').mockResolvedValue(true);
      vi.spyOn(user, 'withinLimits').mockResolvedValue(true);

      expect(await user.isAllowedToRunFlows()).toBe(true);
    });

    it('should return false when the user has active subscription over quota limits', async () => {
      const user = new User();

      vi.spyOn(user, 'hasActiveSubscription').mockResolvedValue(true);
      vi.spyOn(user, 'withinLimits').mockResolvedValue(false);

      expect(await user.isAllowedToRunFlows()).toBe(false);
    });

    it('should return false otherwise', async () => {
      const user = new User();

      expect(await user.isAllowedToRunFlows()).toBe(false);
    });
  });

  describe('inTrial', () => {
    it('should return false when Automatisch is self hosted', async () => {
      const user = new User();

      vi.spyOn(appConfig, 'isSelfHosted', 'get').mockReturnValue(true);

      expect(await user.inTrial()).toBe(false);
    });

    it('should return false when the user does not have trial expiry date', async () => {
      const user = new User();

      vi.spyOn(appConfig, 'isSelfHosted', 'get').mockReturnValue(false);

      expect(await user.inTrial()).toBe(false);
    });

    it('should return false when the user has an active subscription', async () => {
      const user = new User();
      user.trialExpiryDate = '2024-12-14';

      vi.spyOn(appConfig, 'isSelfHosted', 'get').mockReturnValue(false);

      const hasActiveSubscriptionSpy = vi
        .spyOn(user, 'hasActiveSubscription')
        .mockResolvedValue(true);

      expect(await user.inTrial()).toBe(false);
      expect(hasActiveSubscriptionSpy).toHaveBeenCalledOnce();
    });

    it('should return true when trial expiry date is in future', async () => {
      vi.useFakeTimers();

      const date = DateTime.fromObject(
        { year: 2024, month: 11, day: 12, hour: 17, minute: 30 },
        { zone: 'UTC+0' }
      );

      vi.setSystemTime(date);

      const user = await createUser();

      await user.startTrialPeriod();

      const refetchedUser = await user.$query();

      vi.spyOn(appConfig, 'isSelfHosted', 'get').mockReturnValue(false);
      vi.spyOn(refetchedUser, 'hasActiveSubscription').mockResolvedValue(false);

      expect(await refetchedUser.inTrial()).toBe(true);

      vi.useRealTimers();
    });

    it('should return false when trial expiry date is in past', async () => {
      vi.useFakeTimers();

      const user = await createUser();

      await user.startTrialPeriod();

      vi.setSystemTime(DateTime.now().plus({ days: 31 }));

      const refetchedUser = await user.$query();

      vi.spyOn(appConfig, 'isSelfHosted', 'get').mockReturnValue(false);
      vi.spyOn(refetchedUser, 'hasActiveSubscription').mockResolvedValue(false);

      expect(await refetchedUser.inTrial()).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('hasActiveSubscription', () => {
    it('should return true if current subscription is valid', async () => {
      const user = await createUser();
      await createSubscription({ userId: user.id, status: 'active' });

      expect(await user.hasActiveSubscription()).toBe(true);
    });

    it('should return false if current subscription is not valid', async () => {
      const user = await createUser();

      await createSubscription({
        userId: user.id,
        status: 'deleted',
        cancellationEffectiveDate: DateTime.now().minus({ day: 1 }).toString(),
      });

      expect(await user.hasActiveSubscription()).toBe(false);
    });

    it('should return false if Automatisch is not a cloud installation', async () => {
      const user = new User();

      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(false);

      expect(await user.hasActiveSubscription()).toBe(false);
    });
  });

  describe('withinLimits', () => {
    it('should return true when the consumed task count is less than the quota', async () => {
      const user = await createUser();
      const subscription = await createSubscription({ userId: user.id });

      await createUsageData({
        subscriptionId: subscription.id,
        userId: user.id,
        consumedTaskCount: 100,
      });

      expect(await user.withinLimits()).toBe(true);
    });

    it('should return true when the consumed task count is less than the quota', async () => {
      const user = await createUser();
      const subscription = await createSubscription({ userId: user.id });

      await createUsageData({
        subscriptionId: subscription.id,
        userId: user.id,
        consumedTaskCount: 10000,
      });

      expect(await user.withinLimits()).toBe(false);
    });
  });

  describe('getPlanAndUsage', () => {
    it('should return plan and usage', async () => {
      const user = await createUser();

      const subscription = await createSubscription({ userId: user.id });

      expect(await user.getPlanAndUsage()).toStrictEqual({
        usage: {
          task: 0,
        },
        plan: {
          id: subscription.paddlePlanId,
          name: '10k - monthly',
          limit: '10,000',
        },
      });
    });

    it('should return trial plan and usage if no subscription exists', async () => {
      const user = await createUser();

      expect(await user.getPlanAndUsage()).toStrictEqual({
        usage: {
          task: 0,
        },
        plan: {
          id: null,
          name: 'Free Trial',
          limit: null,
        },
      });
    });

    it('should throw not found when the current usage data does not exist', async () => {
      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(false);

      const user = await createUser();

      await expect(() => user.getPlanAndUsage()).rejects.toThrow(
        'NotFoundError'
      );
    });
  });

  describe('getInvoices', () => {
    it('should return invoices for the current subscription', async () => {
      const user = await createUser();
      const subscription = await createSubscription({ userId: user.id });

      const getInvoicesSpy = vi
        .spyOn(Billing.paddleClient, 'getInvoices')
        .mockResolvedValue('dummy-invoices');

      expect(await user.getInvoices()).toBe('dummy-invoices');
      expect(getInvoicesSpy).toHaveBeenCalledWith(
        Number(subscription.paddleSubscriptionId)
      );
    });

    it('should return empty array without any subscriptions', async () => {
      const user = await createUser();

      expect(await user.getInvoices()).toEqual([]);
    });
  });

  describe('hasFolderAccess', () => {
    let currentUser, currentUserFolder;

    beforeEach(async () => {
      currentUser = await createUser();
      currentUserFolder = await createFolder({ userId: currentUser.id });
    });

    it('should return true if the user has access to the folder', async () => {
      const hasAccess = await currentUser.hasFolderAccess(currentUserFolder.id);
      expect(hasAccess).toBe(true);
    });

    it('should throw an error if the user does not have access to the folder', async () => {
      const anotherUser = await createUser();
      const anotherUserFolder = await createFolder({ userId: anotherUser.id });

      await expect(
        currentUser.hasFolderAccess(anotherUserFolder.id)
      ).rejects.toThrow();
    });

    it('should throw an error if the folder does not exist', async () => {
      const nonExistingFolderUUID = Crypto.randomUUID();

      await expect(
        currentUser.hasFolderAccess(nonExistingFolderUUID)
      ).rejects.toThrow();
    });
  });

  describe('getFlows', () => {
    let currentUser,
      currentUserRole,
      anotherUser,
      folder,
      flowOne,
      flowTwo,
      flowThree;

    beforeEach(async () => {
      currentUser = await createUser();
      currentUserRole = await currentUser.$relatedQuery('role');

      anotherUser = await createUser();

      folder = await createFolder({ userId: currentUser.id });
      await createFolder({ userId: anotherUser.id });

      flowOne = await createFlow({
        userId: currentUser.id,
        folderId: folder.id,
        active: true,
        name: 'Flow One',
      });

      flowTwo = await createFlow({
        userId: currentUser.id,
        active: false,
        name: 'Flow Two',
      });

      flowThree = await createFlow({
        userId: anotherUser.id,
        name: 'Flow Three',
      });

      await createPermission({
        action: 'read',
        subject: 'Flow',
        roleId: currentUserRole.id,
        conditions: [],
      });

      currentUser = await currentUser.$query().withGraphFetched({
        role: true,
        permissions: true,
      });
    });

    it('should return flows filtered by name', async () => {
      const flows = await currentUser.getFlows({ name: 'Flow Two' }, [
        folder.id,
      ]);

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowTwo.id);
    });

    it('should return flows filtered by status', async () => {
      const flows = await currentUser.getFlows({ status: 'published' }, [
        folder.id,
      ]);

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return flows filtered by name and status', async () => {
      const flows = await currentUser.getFlows(
        { name: 'Flow One', status: 'published' },
        [folder.id]
      );

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return flows filtered by onlyOwnedFlows', async () => {
      const flows = await currentUser.getFlows({ onlyOwnedFlows: true }, [
        folder.id,
      ]);

      expect(flows).toHaveLength(2);
      expect(flows[0].id).toBe(flowOne.id);
      expect(flows[1].id).toBe(flowTwo.id);
    });

    it('should return flows with specific folder ID', async () => {
      const flows = await currentUser.getFlows({ folderId: folder.id }, [
        folder.id,
      ]);

      expect(flows.length).toBe(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return flows filtered by folderId and name', async () => {
      const flows = await currentUser.getFlows(
        {
          folderId: folder.id,
          name: 'Flow One',
        },
        [folder.id]
      );

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return all flows if no filters are provided', async () => {
      const flows = await currentUser.getFlows({}, [folder.id]);

      expect(flows).toHaveLength(3);
      expect(flows.map((flow) => flow.id)).toEqual(
        expect.arrayContaining([flowOne.id, flowTwo.id, flowThree.id])
      );
    });

    it('should return uncategorized flows if the folderId is null', async () => {
      const flows = await currentUser.getFlows({ folderId: 'null' }, [
        folder.id,
      ]);

      expect(flows).toHaveLength(2);
      expect(flows.map((flow) => flow.id)).toEqual(
        expect.arrayContaining([flowTwo.id, flowThree.id])
      );
    });

    it('should return other users flow as uncategorized flows if the folderId is null', async () => {
      const flows = await currentUser.getFlows({ folderId: 'null' }, [
        folder.id,
      ]);

      expect(flows).toHaveLength(2);
      expect(flows.map((flow) => flow.id)).toEqual(
        expect.arrayContaining([flowTwo.id, flowThree.id])
      );
    });

    it('should return specified flows with all filters together', async () => {
      const flows = await currentUser.getFlows(
        {
          folderId: folder.id,
          name: 'Flow One',
          status: 'published',
          onlyOwnedFlows: true,
        },
        [folder.id]
      );

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });
  });

  describe('getExecutions', () => {
    let currentUser,
      currentUserRole,
      anotherUser,
      flow,
      executionOne,
      executionTwo,
      executionThree;

    beforeEach(async () => {
      currentUser = await createUser();
      currentUserRole = await currentUser.$relatedQuery('role');

      anotherUser = await createUser();

      flow = await createFlow({
        userId: currentUser.id,
        name: 'Test Flow',
      });

      const anotherUserFlow = await createFlow({
        userId: anotherUser.id,
        name: 'Another User Flow',
      });

      executionOne = await createExecution({
        flowId: flow.id,
        testRun: false,
      });

      executionTwo = await createExecution({
        flowId: flow.id,
        testRun: true,
      });

      executionThree = await createExecution({
        flowId: anotherUserFlow.id,
        testRun: false,
      });

      await createPermission({
        action: 'read',
        subject: 'Execution',
        roleId: currentUserRole.id,
        conditions: [],
      });

      currentUser = await currentUser.$query().withGraphFetched({
        role: true,
        permissions: true,
      });
    });

    it('should return executions filtered by name', async () => {
      const executions = await currentUser.getExecutions({ name: 'Test Flow' });

      expect(executions).toHaveLength(2);

      expect(executions[0].id).toBe(executionTwo.id);
      expect(executions[1].id).toBe(executionOne.id);
    });

    it('should return all executions when no filter is applied', async () => {
      const executions = await currentUser.getExecutions({});

      expect(executions.length).toBeGreaterThanOrEqual(3);

      expect(executions.some((e) => e.id === executionOne.id)).toBe(true);
      expect(executions.some((e) => e.id === executionTwo.id)).toBe(true);
      expect(executions.some((e) => e.id === executionThree.id)).toBe(true);
    });

    it('should include flow and steps in the returned executions', async () => {
      const step = await createStep({
        flowId: flow.id,
        type: 'trigger',
      });

      const executions = await currentUser.getExecutions({ name: 'Test Flow' });

      expect(executions[0].flow.id).toBe(flow.id);
      expect(executions[0].flow.steps[0].id).toBe(step.id);
    });
  });

  it.todo('getApps');

  it('createAdmin should create admin with given data and mark the installation completed', async () => {
    const adminRole = await createRole({ name: 'Admin' });

    const markInstallationCompletedSpy = vi
      .spyOn(Config, 'markInstallationCompleted')
      .mockResolvedValue();

    const adminUser = await User.createAdmin({
      fullName: 'Sample admin',
      email: 'admin@automatisch.io',
      password: 'sample',
    });

    expect(adminUser).toMatchObject({
      fullName: 'Sample admin',
      email: 'admin@automatisch.io',
      roleId: adminRole.id,
    });

    expect(markInstallationCompletedSpy).toHaveBeenCalledOnce();
    expect(await adminUser.login('sample')).toBe(true);
  });

  describe('registerUser', () => {
    it('should register user with user role and given data', async () => {
      const userRole = await createRole({ name: 'User' });

      const user = await User.registerUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
        password: 'sample-password',
      });

      expect(user).toMatchObject({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
        roleId: userRole.id,
      });

      expect(await user.login('sample-password')).toBe(true);
    });

    it('should throw not found error when user role does not exist', async () => {
      await expect(() =>
        User.registerUser({
          fullName: 'Sample user',
          email: 'user@automatisch.io',
          password: 'sample-password',
        })
      ).rejects.toThrowError('NotFoundError');
    });
  });

  describe('can', () => {
    it('should return conditions for the given action and subject of the user', async () => {
      const userRole = await createRole({ name: 'User' });

      await createPermission({
        roleId: userRole.id,
        subject: 'Flow',
        action: 'read',
        conditions: ['isCreator'],
      });

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

      expect(userWithRoleAndPermissions.can('read', 'Flow')).toStrictEqual({
        isCreator: true,
      });

      expect(
        userWithRoleAndPermissions.can('read', 'Connection')
      ).toStrictEqual({});
    });

    it('should return not authorized error when the user is not permitted for the given action and subject', async () => {
      const userRole = await createRole({ name: 'User' });
      const user = await createUser({ roleId: userRole.id });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      expect(() => userWithRoleAndPermissions.can('read', 'Flow')).toThrowError(
        'The user is not authorized!'
      );
    });
  });

  it('lowercaseEmail should lowercase the user email', () => {
    const user = new User();
    user.email = 'USER@AUTOMATISCH.IO';

    user.lowercaseEmail();

    expect(user.email).toBe('user@automatisch.io');
  });

  describe('createUsageData', () => {
    it('should create usage data if Automatisch is a cloud installation', async () => {
      vi.useFakeTimers();

      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);

      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      vi.setSystemTime(DateTime.now().plus({ month: 1 }));

      const usageData = await user.createUsageData();
      const currentUsageData = await user.$relatedQuery('currentUsageData');

      expect(usageData).toStrictEqual(currentUsageData);

      vi.useRealTimers();
    });

    it('should not create usage data if Automatisch is not a cloud installation', async () => {
      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(false);

      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      const usageData = await user.createUsageData();

      expect(usageData).toBe(undefined);
    });
  });

  describe('omitEnterprisePermissionsWithoutValidLicense', () => {
    it('should return user as-is with valid license', async () => {
      const userRole = await createRole({ name: 'User' });
      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
        roleId: userRole.id,
      });

      const readFlowPermission = await createPermission({
        roleId: userRole.id,
        subject: 'Flow',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'App',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'Role',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'Config',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'SamlAuthProvider',
        action: 'read',
        conditions: [],
      });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      expect(userWithRoleAndPermissions.permissions).toStrictEqual([
        readFlowPermission,
      ]);
    });

    it('should omit enterprise permissions without valid license', async () => {
      vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(false);

      const userRole = await createRole({ name: 'User' });
      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
        roleId: userRole.id,
      });

      const readFlowPermission = await createPermission({
        roleId: userRole.id,
        subject: 'Flow',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'App',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'Role',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'Config',
        action: 'read',
        conditions: [],
      });

      await createPermission({
        roleId: userRole.id,
        subject: 'SamlAuthProvider',
        action: 'read',
        conditions: [],
      });

      const userWithRoleAndPermissions = await user
        .$query()
        .withGraphFetched({ role: true, permissions: true });

      expect(userWithRoleAndPermissions.permissions).toStrictEqual([
        readFlowPermission,
      ]);
    });
  });

  describe('createEmptyFlow', () => {
    it('should create a flow with default name', async () => {
      const user = await createUser();
      const flow = await user.createEmptyFlow();

      expect(flow.name).toBe('Name your flow');
      expect(flow.userId).toBe(user.id);
    });

    it('should call createInitialSteps on the created flow', async () => {
      const user = await createUser();
      const createInitialStepsSpy = vi.spyOn(
        Flow.prototype,
        'createInitialSteps'
      );

      await user.createEmptyFlow();

      expect(createInitialStepsSpy).toHaveBeenCalledOnce();
    });
  });

  describe('createFlowFromTemplate', () => {
    let user, template;

    beforeEach(async () => {
      user = await createUser();
      template = await createTemplate();
    });

    it('should throw an error if template is not found', async () => {
      const nonExistentTemplateId = Crypto.randomUUID();

      await expect(
        user.createFlowFromTemplate(nonExistentTemplateId)
      ).rejects.toThrow('NotFoundError');
    });

    it('should call Flow.import with the correct parameters', async () => {
      vi.spyOn(Template.query(), 'findById').mockImplementation(() => ({
        throwIfNotFound: () => template,
      }));

      const importSpy = vi.spyOn(Flow, 'import').mockResolvedValue({
        id: Crypto.randomUUID(),
        name: template.flowData.name,
        steps: [],
      });

      await user.createFlowFromTemplate(template.id);

      expect(importSpy).toHaveBeenCalledWith(user, template.flowData);
    });
  });

  describe('$beforeInsert', () => {
    it('should call super.$beforeInsert', async () => {
      const superBeforeInsertSpy = vi
        .spyOn(User.prototype, '$beforeInsert')
        .mockResolvedValue();

      await createUser();

      expect(superBeforeInsertSpy).toHaveBeenCalledOnce();
    });

    it('should lowercase the user email', async () => {
      const user = await createUser({
        fullName: 'Sample user',
        email: 'USER@AUTOMATISCH.IO',
      });

      expect(user.email).toBe('user@automatisch.io');
    });

    it('should generate password hash', async () => {
      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
        password: 'sample-password',
      });

      expect(user.password).not.toBe('sample-password');
      expect(await user.login('sample-password')).toBe(true);
    });

    it('should start trial period if Automatisch is a cloud installation', async () => {
      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);

      const startTrialPeriodSpy = vi.spyOn(User.prototype, 'startTrialPeriod');

      await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      expect(startTrialPeriodSpy).toHaveBeenCalledOnce();
    });

    it('should not start trial period if Automatisch is not a cloud installation', async () => {
      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(false);

      const startTrialPeriodSpy = vi.spyOn(User.prototype, 'startTrialPeriod');

      await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      expect(startTrialPeriodSpy).not.toHaveBeenCalled();
    });
  });

  describe('$beforeUpdate', () => {
    it('should call super.$beforeUpdate', async () => {
      const superBeforeUpdateSpy = vi
        .spyOn(User.prototype, '$beforeUpdate')
        .mockResolvedValue();

      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      await user.$query().patch({ fullName: 'Updated user name' });

      expect(superBeforeUpdateSpy).toHaveBeenCalledOnce();
    });

    it('should lowercase the user email if given', async () => {
      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      await user.$query().patchAndFetch({ email: 'NEW_EMAIL@AUTOMATISCH.IO' });

      expect(user.email).toBe('new_email@automatisch.io');
    });

    it('should generate password hash', async () => {
      const user = await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
        password: 'sample-password',
      });

      await user.$query().patchAndFetch({ password: 'new-password' });

      expect(user.password).not.toBe('new-password');
      expect(await user.login('new-password')).toBe(true);
    });
  });

  describe('$afterInsert', () => {
    it('should call super.$afterInsert', async () => {
      const superAfterInsertSpy = vi.spyOn(User.prototype, '$afterInsert');

      await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      expect(superAfterInsertSpy).toHaveBeenCalledOnce();
    });

    it('should call createUsageData', async () => {
      const createUsageDataSpy = vi.spyOn(User.prototype, 'createUsageData');

      await createUser({
        fullName: 'Sample user',
        email: 'user@automatisch.io',
      });

      expect(createUsageDataSpy).toHaveBeenCalledOnce();
    });
  });

  it('$afterFind should invoke omitEnterprisePermissionsWithoutValidLicense method', async () => {
    const omitEnterprisePermissionsWithoutValidLicenseSpy = vi.spyOn(
      User.prototype,
      'omitEnterprisePermissionsWithoutValidLicense'
    );

    await createUser({
      fullName: 'Sample user',
      email: 'user@automatisch.io',
    });

    expect(
      omitEnterprisePermissionsWithoutValidLicenseSpy
    ).toHaveBeenCalledOnce();
  });
});
