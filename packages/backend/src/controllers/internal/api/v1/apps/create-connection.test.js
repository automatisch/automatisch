import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createAppConfig } from '@/factories/app-config.js';
import { createOAuthClient } from '@/factories/oauth-client.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createRole } from '@/factories/role.js';
import createConnection from '@/mocks/rest/internal/api/v1/apps/create-connection.js';

describe('POST /internal/api/v1/apps/:appKey/connections', () => {
  let currentUser, token;

  beforeEach(async () => {
    const role = await createRole();

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: role.id,
    });

    await createPermission({
      action: 'manage',
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
        .post('/internal/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(201);

      const fetchedConnection =
        await currentUser.readableConnections.findById(response.body.data.id);

      const expectedPayload = createConnection({
        ...fetchedConnection,
        formattedData: {},
      });

      expect(response.body).toStrictEqual(expectedPayload);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/internal/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
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
        .post('/internal/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(403);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/internal/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
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
        useOnlyPredefinedAuthClients: false,
      });
    });

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
        .post('/internal/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(201);

      const fetchedConnection =
        await currentUser.readableConnections.findById(response.body.data.id);

      const expectedPayload = createConnection({
        ...fetchedConnection,
        formattedData: {},
      });

      expect(response.body).toStrictEqual(expectedPayload);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/internal/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
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
        useOnlyPredefinedAuthClients: true,
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
        .post('/internal/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(403);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/internal/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
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

  describe('with auth client enabled', async () => {
    let oauthClient;

    beforeEach(async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: false,
        useOnlyPredefinedAuthClients: false,
      });

      oauthClient = await createOAuthClient({
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
        oauthClientId: oauthClient.id,
      };

      const response = await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(201);

      const fetchedConnection =
        await currentUser.readableConnections.findById(response.body.data.id);

      const expectedPayload = createConnection({
        ...fetchedConnection,
        formattedData: {},
      });

      expect(response.body).toStrictEqual(expectedPayload);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/internal/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
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

  describe('with auth client disabled', async () => {
    let oauthClient;

    beforeEach(async () => {
      await createAppConfig({
        key: 'gitlab',
        disabled: false,
        useOnlyPredefinedAuthClients: false,
      });

      oauthClient = await createOAuthClient({
        appKey: 'gitlab',
        active: false,
      });
    });

    it('should return with not authorized response', async () => {
      const connectionData = {
        oauthClientId: oauthClient.id,
      };

      await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
        .set('Authorization', token)
        .send(connectionData)
        .expect(404);
    });

    it('should return not found response for invalid app key', async () => {
      await request(app)
        .post('/internal/api/v1/apps/invalid-app-key/connections')
        .set('Authorization', token)
        .expect(404);
    });

    it('should return unprocesible entity response for invalid connection data', async () => {
      const response = await request(app)
        .post('/internal/api/v1/apps/gitlab/connections')
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
