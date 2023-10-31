// @ts-nocheck
import request from 'supertest';
import app from '../../app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import { createRole } from '../../../test/factories/role';
import { createPermission } from '../../../test/factories/permission';
import { createUser } from '../../../test/factories/user';

describe('graphQL getUsers query', () => {
  const query = `
    query {
      getUsers(limit: 10, offset: 0) {
        pageInfo {
          currentPage
          totalPages
        }
        totalCount
        edges {
          node {
            id
            fullName
            email
            role {
              id
              name
            }
          }
        }
      }
    }
  `;

  describe('with unauthenticated user', () => {
    it('should throw not authorized error', async () => {
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

    describe('and with correct permissions', () => {
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
          fullName: 'Current User',
        });

        anotherUser = await createUser({
          roleId: role.id,
          fullName: 'Another User',
        });

        token = createAuthTokenByUserId(currentUser.id);
        requestObject = request(app)
          .post('/graphql')
          .set('Authorization', token);
      });

      it('should return users data', async () => {
        const response = await requestObject.send({ query }).expect(200);

        const expectedResponsePayload = {
          data: {
            getUsers: {
              edges: [
                {
                  node: {
                    email: anotherUser.email,
                    fullName: anotherUser.fullName,
                    id: anotherUser.id,
                    role: {
                      id: role.id,
                      name: role.name,
                    },
                  },
                },
                {
                  node: {
                    email: currentUser.email,
                    fullName: currentUser.fullName,
                    id: currentUser.id,
                    role: {
                      id: role.id,
                      name: role.name,
                    },
                  },
                },
              ],
              pageInfo: {
                currentPage: 1,
                totalPages: 1,
              },
              totalCount: 2,
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });

      it('should not return users data with password', async () => {
        const query = `
          query {
            getUsers(limit: 10, offset: 0) {
              pageInfo {
                currentPage
                totalPages
              }
              totalCount
              edges {
                node {
                  id
                  fullName
                  password
                }
              }
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
});
