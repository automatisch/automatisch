import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createAppConfig } from '../../../../../test/factories/app-config.js';
import { createAppAuthClient } from '../../../../../test/factories/app-auth-client.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createPermission } from '../../../../../test/factories/permission.js';
import { createRole } from '../../../../../test/factories/role.js';
import createConnection from '../../../../../test/mocks/rest/api/v1/apps/create-connection.js';

describe('POST /api/v1/apps/:appKey/connections', () => {
  let currentUser, token;

  beforeEach(async () => {
    const role = await createRole();

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: role.id,
    });

    await createPermission({
      action: 'create',
      subject: 'Connection',
      roleId: role.id,
    });

    currentUser = await createUser({ roleId: role.id });

    currentUser = await currentUser
      .$query()
      .leftJoinRelated({
        role: true,
        permissions: true,
      })
      .withGraphFetched({
        role: true,
        permissions: true,
      });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  describe('with no app config', async () => {
    it('should return created connection', async () => {
      const connectionData = {
        formattedData: {
          oAuthRedirectUrl: 'http://localhost:3000/app/gitlab/connections/add',
          instanceUrl: 'https://gitlab.com',
          clientId: 'sample_client_id',
          clientSecret: 'sample_client_secret',
        },
      };

      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(201);

      const fetchedConnection =
        await currentUser.authorizedConnections.findById(response.body.data.id);

      const expectedPayload = createConnection({
        ...fetchedConnection,
        formattedData: {},
      });

      expect(response.body).toStrictEqual(expectedPayload);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send({
          formattedData: 123,
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        errors: {
          formattedData: ['must be object'],
        },
        meta: {
          type: 'ModelValidation',
        },
      });
    });
  });

  describe('with app disabled', async () => {
    beforeEach(async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: true,
      });
    });

    it('should return with not authorized response', async () => {
      const connectionData = {
        formattedData: {
          oAuthRedirectUrl: 'http://localhost:3000/app/gitlab/connections/add',
          instanceUrl: 'https://gitlab.com',
          clientId: 'sample_client_id',
          clientSecret: 'sample_client_secret',
        },
      };

      await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(403);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send({
          formattedData: 123,
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        errors: {
          formattedData: ['must be object'],
        },
        meta: {
          type: 'ModelValidation',
        },
      });
    });
  });

  describe('with custom connections enabled', async () => {
    beforeEach(async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: false,
        customConnectionAllowed: true,
      });
    });

    it('should return created conncetion', async () => {
      const connectionData = {
        formattedData: {
          oAuthRedirectUrl: 'http://localhost:3000/app/gitlab/connections/add',
          instanceUrl: 'https://gitlab.com',
          clientId: 'sample_client_id',
          clientSecret: 'sample_client_secret',
        },
      };

      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(201);

      const fetchedConnection =
        await currentUser.authorizedConnections.findById(response.body.data.id);

      const expectedPayload = createConnection({
        ...fetchedConnection,
        formattedData: {},
      });

      expect(response.body).toStrictEqual(expectedPayload);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send({
          formattedData: 123,
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        errors: {
          formattedData: ['must be object'],
        },
        meta: {
          type: 'ModelValidation',
        },
      });
    });
  });

  describe('with custom connections disabled', async () => {
    beforeEach(async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: false,
        customConnectionAllowed: false,
      });
    });

    it('should return with not authorized response', async () => {
      const connectionData = {
        formattedData: {
          oAuthRedirectUrl: 'http://localhost:3000/app/gitlab/connections/add',
          instanceUrl: 'https://gitlab.com',
          clientId: 'sample_client_id',
          clientSecret: 'sample_client_secret',
        },
      };

      await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(403);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send({
          formattedData: 123,
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        errors: {
          formattedData: ['must be object'],
        },
        meta: {
          type: 'ModelValidation',
        },
      });
    });
  });

  describe('with auth clients enabled', async () => {
    let appAuthClient;

    beforeEach(async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: false,
        shared: true,
      });

      appAuthClient = await createAppAuthClient({
        appKey: 'gitlab',
        active: true,
        formattedAuthDefaults: {
          oAuthRedirectUrl: 'http://localhost:3000/app/gitlab/connections/add',
          instanceUrl: 'https://gitlab.com',
          clientId: 'sample_client_id',
          clientSecret: 'sample_client_secret',
        },
      });
    });

    it('should return created connection', async () => {
      const connectionData = {
        appAuthClientId: appAuthClient.id,
      };

      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(201);

      const fetchedConnection =
        await currentUser.authorizedConnections.findById(response.body.data.id);

      const expectedPayload = createConnection({
        ...fetchedConnection,
        formattedData: {},
      });

      expect(response.body).toStrictEqual(expectedPayload);
    });

    it('should return not authorized response for appAuthClientId and formattedData together', async () => {
      const connectionData = {
        appAuthClientId: appAuthClient.id,
        formattedData: {},
      };

      await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(403);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send({
          formattedData: 123,
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        errors: {
          formattedData: ['must be object'],
        },
        meta: {
          type: 'ModelValidation',
        },
      });
    });
  });
  describe('with auth clients disabled', async () => {
    let appAuthClient;

    beforeEach(async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: false,
        shared: false,
      });

      appAuthClient = await createAppAuthClient({
        appKey: 'gitlab',
      });
    });

    it('should return with not authorized response', async () => {
      const connectionData = {
        appAuthClientId: appAuthClient.id,
      };

      await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(403);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send({
          formattedData: 123,
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        errors: {
          formattedData: ['must be object'],
        },
        meta: {
          type: 'ModelValidation',
        },
      });
    });
  });
});
