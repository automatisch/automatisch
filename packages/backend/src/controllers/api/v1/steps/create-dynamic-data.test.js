import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import { createConnection } from '../../../../../test/factories/connection';
import { createFlow } from '../../../../../test/factories/flow';
import { createStep } from '../../../../../test/factories/step';
import { createPermission } from '../../../../../test/factories/permission';
import listRepos from '../../../../apps/github/dynamic-data/list-repos/index.js';
import HttpError from '../../../../errors/http.js';

describe('POST /api/v1/steps/:stepId/dynamic-data', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  describe('should return dynamically created data', () => {
    let repositories;

    beforeEach(async () => {
      repositories = [
        {
          value: 'automatisch/automatisch',
          name: 'automatisch/automatisch',
        },
        {
          value: 'automatisch/sample',
          name: 'automatisch/sample',
        },
      ];

      vi.spyOn(listRepos, 'run').mockImplementation(async () => {
        return {
          data: repositories,
        };
      });
    });

    it('of the current users step', async () => {
      const currentUserFlow = await createFlow({ userId: currentUser.id });
      const connection = await createConnection({ userId: currentUser.id });

      const actionStep = await createStep({
        flowId: currentUserFlow.id,
        connectionId: connection.id,
        type: 'action',
        appKey: 'github',
        key: 'createIssue',
      });

      await createPermission({
        action: 'read',
        subject: 'Flow',
        roleId: currentUserRole.id,
        conditions: ['isCreator'],
      });

      await createPermission({
        action: 'update',
        subject: 'Flow',
        roleId: currentUserRole.id,
        conditions: ['isCreator'],
      });

      const response = await request(app)
        .post(`/api/v1/steps/${actionStep.id}/dynamic-data`)
        .set('Authorization', token)
        .send({
          dynamicDataKey: 'listRepos',
          parameters: {},
        })
        .expect(200);

      expect(response.body.data).toEqual(repositories);
    });

    it('of the another users step', async () => {
      const anotherUser = await createUser();
      const anotherUserFlow = await createFlow({ userId: anotherUser.id });
      const connection = await createConnection({ userId: anotherUser.id });

      const actionStep = await createStep({
        flowId: anotherUserFlow.id,
        connectionId: connection.id,
        type: 'action',
        appKey: 'github',
        key: 'createIssue',
      });

      await createPermission({
        action: 'read',
        subject: 'Flow',
        roleId: currentUserRole.id,
        conditions: [],
      });

      await createPermission({
        action: 'update',
        subject: 'Flow',
        roleId: currentUserRole.id,
        conditions: [],
      });

      const response = await request(app)
        .post(`/api/v1/steps/${actionStep.id}/dynamic-data`)
        .set('Authorization', token)
        .send({
          dynamicDataKey: 'listRepos',
          parameters: {},
        })
        .expect(200);

      expect(response.body.data).toEqual(repositories);
    });
  });

  describe('should return error for dynamically created data', () => {
    let errors;

    beforeEach(async () => {
      errors = {
        message: 'Not Found',
        documentation_url:
          'https://docs.github.com/rest/users/users#get-a-user',
      };

      vi.spyOn(listRepos, 'run').mockImplementation(async () => {
        throw new HttpError({ message: errors });
      });
    });

    it('of the current users step', async () => {
      const currentUserFlow = await createFlow({ userId: currentUser.id });
      const connection = await createConnection({ userId: currentUser.id });

      const actionStep = await createStep({
        flowId: currentUserFlow.id,
        connectionId: connection.id,
        type: 'action',
        appKey: 'github',
        key: 'createIssue',
      });

      await createPermission({
        action: 'read',
        subject: 'Flow',
        roleId: currentUserRole.id,
        conditions: ['isCreator'],
      });

      await createPermission({
        action: 'update',
        subject: 'Flow',
        roleId: currentUserRole.id,
        conditions: ['isCreator'],
      });

      const response = await request(app)
        .post(`/api/v1/steps/${actionStep.id}/dynamic-data`)
        .set('Authorization', token)
        .send({
          dynamicDataKey: 'listRepos',
          parameters: {},
        })
        .expect(200);

      expect(response.body.errors).toEqual(errors);
    });
  });

  it('should return not found response for not existing step UUID', async () => {
    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingStepUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/steps/${notExistingStepUUID}/dynamic-data`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for existing step UUID without app key', async () => {
    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const step = await createStep({ appKey: null });

    await request(app)
      .get(`/api/v1/steps/${step.id}/dynamic-data`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .post('/api/v1/steps/invalidStepUUID/dynamic-fields')
      .set('Authorization', token)
      .expect(400);
  });
});
