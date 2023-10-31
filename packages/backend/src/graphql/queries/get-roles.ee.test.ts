// @ts-nocheck
import request from 'supertest';
import app from '../../app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import { createRole } from '../../../test/factories/role';
import { createPermission } from '../../../test/factories/permission';
import { createUser } from '../../../test/factories/user';
import * as license from '../../helpers/license.ee';

describe('graphQL getRoles query', () => {
  let currentUserRole,
    roleOne,
    roleSecond,
    query,
    userWithPermissions,
    userWithoutPermissions,
    tokenWithPermissions,
    tokenWithoutPermissions,
    invalidToken;

  beforeEach(async () => {
    currentUserRole = await createRole({ name: 'Current user role' });
    roleOne = await createRole({ name: 'Role one' });
    roleSecond = await createRole({ name: 'Role second' });

    query = `
      query {
        getRoles {
          id
          key
          name
          description
          isAdmin
        }
      }
    `;

    await createPermission({
      action: 'read',
      subject: 'Role',
      roleId: currentUserRole.id,
    });

    userWithPermissions = await createUser({
      roleId: currentUserRole.id,
    });

    userWithoutPermissions = await createUser({
      roleId: roleOne.id,
    });

    tokenWithPermissions = createAuthTokenByUserId(userWithPermissions.id);
    tokenWithoutPermissions = createAuthTokenByUserId(
      userWithoutPermissions.id
    );

    invalidToken = 'invalid-token';
  });

  describe('with unauthenticated user', () => {
    it('should throw not authorized error', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', invalidToken)
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toEqual('Not Authorised!');
    });
  });

  describe('with authenticated user', () => {
    describe('and with valid license', () => {
      beforeEach(async () => {
        jest.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
      });

      describe('and without permissions', () => {
        it('should throw not authorized error', async () => {
          const response = await request(app)
            .post('/graphql')
            .set('Authorization', tokenWithoutPermissions)
            .send({ query })
            .expect(200);

          expect(response.body.errors).toBeDefined();
          expect(response.body.errors[0].message).toEqual('Not authorized!');
        });
      });

      describe('and correct permissions', () => {
        it('should return roles data', async () => {
          const response = await request(app)
            .post('/graphql')
            .set('Authorization', tokenWithPermissions)
            .send({ query })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getRoles: [
                {
                  description: currentUserRole.description,
                  id: currentUserRole.id,
                  isAdmin: currentUserRole.key === 'admin',
                  key: currentUserRole.key,
                  name: currentUserRole.name,
                },
                {
                  description: roleOne.description,
                  id: roleOne.id,
                  isAdmin: roleOne.key === 'admin',
                  key: roleOne.key,
                  name: roleOne.name,
                },
                {
                  description: roleSecond.description,
                  id: roleSecond.id,
                  isAdmin: roleSecond.key === 'admin',
                  key: roleSecond.key,
                  name: roleSecond.name,
                },
              ],
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });
      });
    });

    describe('and without valid license', () => {
      beforeEach(async () => {
        jest.spyOn(license, 'hasValidLicense').mockResolvedValue(false);
      });

      describe('and correct permissions', () => {
        it('should throw not authorized error', async () => {
          const response = await request(app)
            .post('/graphql')
            .set('Authorization', tokenWithPermissions)
            .send({ query })
            .expect(200);

          expect(response.body.errors).toBeDefined();
          expect(response.body.errors[0].message).toEqual('Not authorized!');
        });
      });
    });
  });
});
