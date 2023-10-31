// @ts-nocheck
import request from 'supertest';
import app from '../../app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import Crypto from 'crypto';
import { createRole } from '../../../test/factories/role';
import { createPermission } from '../../../test/factories/permission';
import { createUser } from '../../../test/factories/user';
import * as license from '../../helpers/license.ee';

describe('graphQL getRole query', () => {
  let validRole,
    invalidRoleId,
    queryWithValidRole,
    queryWithInvalidRole,
    userWithPermissions,
    userWithoutPermissions,
    tokenWithPermissions,
    tokenWithoutPermissions,
    invalidToken,
    permissionOne,
    permissionTwo;

  beforeEach(async () => {
    validRole = await createRole();
    invalidRoleId = Crypto.randomUUID();

    queryWithValidRole = `
      query {
        getRole(id: "${validRole.id}") {
          id
          name
          key
          description
          isAdmin
          permissions {
            id
            action
            subject
            conditions
          }
        }
      }
    `;

    queryWithInvalidRole = `
      query {
        getRole(id: "${invalidRoleId}") {
          id
          name
        }
      }
    `;

    permissionOne = await createPermission({
      action: 'read',
      subject: 'Role',
      roleId: validRole.id,
    });

    permissionTwo = await createPermission({
      action: 'read',
      subject: 'User',
      roleId: validRole.id,
    });

    userWithPermissions = await createUser({
      roleId: validRole.id,
    });

    userWithoutPermissions = await createUser();

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
        .send({ query: queryWithValidRole })
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
            .send({ query: queryWithValidRole })
            .expect(200);

          expect(response.body.errors).toBeDefined();
          expect(response.body.errors[0].message).toEqual('Not authorized!');
        });
      });

      describe('and correct permissions', () => {
        it('should return role data for a valid role id', async () => {
          const response = await request(app)
            .post('/graphql')
            .set('Authorization', tokenWithPermissions)
            .send({ query: queryWithValidRole })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getRole: {
                description: validRole.description,
                id: validRole.id,
                isAdmin: validRole.key === 'admin',
                key: validRole.key,
                name: validRole.name,
                permissions: [
                  {
                    action: permissionOne.action,
                    conditions: permissionOne.conditions,
                    id: permissionOne.id,
                    subject: permissionOne.subject,
                  },
                  {
                    action: permissionTwo.action,
                    conditions: permissionTwo.conditions,
                    id: permissionTwo.id,
                    subject: permissionTwo.subject,
                  },
                ],
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });

        it('should return not found for invalid role id', async () => {
          const response = await request(app)
            .post('/graphql')
            .set('Authorization', tokenWithPermissions)
            .send({ query: queryWithInvalidRole })
            .expect(200);

          expect(response.body.errors).toBeDefined();
          expect(response.body.errors[0].message).toEqual('NotFoundError');
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
            .send({ query: queryWithInvalidRole })
            .expect(200);

          expect(response.body.errors).toBeDefined();
          expect(response.body.errors[0].message).toEqual('Not authorized!');
        });
      });
    });
  });
});
