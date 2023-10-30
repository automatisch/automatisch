// @ts-nocheck
import request from 'supertest';
import app from '../../app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import { createRole } from '../../../test/factories/role';
import { createUser } from '../../../test/factories/user';

describe('graphQL getCurrentUser query', () => {
  describe('with unauthenticated user', () => {
    it('should throw not authorized error', async () => {
      const invalidUserToken = 'invalid-token';

      const query = `
        query {
          getCurrentUser {
            id
            email
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', invalidUserToken)
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toEqual('Not Authorised!');
    });
  });

  describe('with authenticated user', () => {
    let role, currentUser, token, requestObject;

    beforeEach(async () => {
      role = await createRole({
        key: 'sample',
        name: 'sample',
      });

      currentUser = await createUser({
        roleId: role.id,
      });

      token = createAuthTokenByUserId(currentUser.id);
      requestObject = request(app).post('/graphql').set('Authorization', token);
    });

    it('should return user data', async () => {
      const query = `
        query {
          getCurrentUser {
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
          getCurrentUser: {
            createdAt: currentUser.createdAt.getTime().toString(),
            email: currentUser.email,
            fullName: currentUser.fullName,
            id: currentUser.id,
            role: { id: role.id, name: role.name },
            updatedAt: currentUser.updatedAt.getTime().toString(),
          },
        },
      };

      expect(response.body).toEqual(expectedResponsePayload);
    });

    it('should not return user password', async () => {
      const query = `
        query {
          getCurrentUser {
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
  });
});
