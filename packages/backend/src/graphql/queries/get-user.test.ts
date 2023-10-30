// @ts-nocheck
import request from 'supertest';
import app from '../../app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import Crypto from 'crypto';
import { createRole } from '../../../test/factories/role';
import { createPermission } from '../../../test/factories/permission';
import { createUser } from '../../../test/factories/user';

describe('graphQL getUser query', () => {
  describe('with unauthenticated user', () => {
    it('should throw not authorized error', async () => {
      const invalidUserId = '123123123';

      const query = `
        query {
          getUser(id: "${invalidUserId}") {
            id
            email
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', 'invalid-token')
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toEqual('Not Authorised!');
    });
  });

  describe('with authenticated user', () => {
    describe('and without permissions', () => {
      it('should throw not authorized error', async () => {
        const userWithoutPermissions = await createUser();
        const anotherUser = await createUser();

        const query = `
          query {
            getUser(id: "${anotherUser.id}") {
              id
              email
            }
          }
        `;

        const token = createAuthTokenByUserId(userWithoutPermissions.id);

        const response = await request(app)
          .post('/graphql')
          .set('Authorization', token)
          .send({ query })
          .expect(200);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toEqual('Not authorized!');
      });
    });

    describe('and correct permissions', () => {
      let role, currentUser, anotherUser, token, requestObject;

      beforeEach(async () => {
        role = await createRole({
          key: 'sample',
          name: 'sample',
        });

        await createPermission({
          action: 'read',
          subject: 'User',
          roleId: role.id,
        });

        currentUser = await createUser({
          roleId: role.id,
        });

        anotherUser = await createUser({
          roleId: role.id,
        });

        token = createAuthTokenByUserId(currentUser.id);
        requestObject = request(app)
          .post('/graphql')
          .set('Authorization', token);
      });

      it('should return user data for a valid user id', async () => {
        const query = `
          query {
            getUser(id: "${anotherUser.id}") {
              id
              email
              fullName
              email
              createdAt
              updatedAt
              role {
                id
                name
              }
            }
          }
        `;

        const response = await requestObject.send({ query }).expect(200);

        const expectedResponsePayload = {
          data: {
            getUser: {
              createdAt: anotherUser.createdAt.getTime().toString(),
              email: anotherUser.email,
              fullName: anotherUser.fullName,
              id: anotherUser.id,
              role: { id: role.id, name: role.name },
              updatedAt: anotherUser.updatedAt.getTime().toString(),
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });

      it('should not return user password for a valid user id', async () => {
        const query = `
          query {
            getUser(id: "${anotherUser.id}") {
              id
              email
              password
            }
          }
        `;

        const response = await requestObject.send({ query }).expect(400);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toEqual(
          'Cannot query field "password" on type "User".'
        );
      });

      it('should return not found for invalid user id', async () => {
        const invalidUserId = Crypto.randomUUID();

        const query = `
          query {
            getUser(id: "${invalidUserId}") {
              id
              email
              fullName
              email
              createdAt
              updatedAt
              role {
                id
                name
              }
            }
          }
        `;

        const response = await requestObject.send({ query }).expect(200);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toEqual('NotFoundError');
      });
    });
  });
});
