import request from 'supertest';
import app from '../../app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import Crypto from 'crypto';

describe('getUser', () => {
  describe('with unauthorized user', () => {
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

  describe('with authorized user', () => {
    it('should return user data for a valid user id', async () => {
      const [role] = await knex
        .table('roles')
        .insert({
          key: 'sample',
          name: 'sample',
        })
        .returning('*');

      await knex.table('permissions').insert({
        action: 'read',
        subject: 'User',
        role_id: role.id,
      });

      const [currentUser] = await knex
        .table('users')
        .insert({
          full_name: 'Test User',
          email: 'sample@sample.com',
          password: 'secret',
          role_id: role.id,
        })
        .returning('*');

      const [anotherUser] = await global.knex
        .table('users')
        .insert({
          full_name: 'Another User',
          email: 'another@sample.com',
          password: 'secret',
          role_id: role.id,
        })
        .returning('*');

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

      const token = createAuthTokenByUserId(currentUser.id);

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `${token}`)
        .send({ query })
        .expect(200);

      const expectedResponsePayload = {
        data: {
          getUser: {
            createdAt: anotherUser.created_at.getTime().toString(),
            email: anotherUser.email,
            fullName: anotherUser.full_name,
            id: anotherUser.id,
            role: { id: role.id, name: role.name },
            updatedAt: anotherUser.updated_at.getTime().toString(),
          },
        },
      };

      expect(response.body).toEqual(expectedResponsePayload);
    });

    it('should return not found for invalid user id', async () => {
      const [role] = await knex('roles')
        .insert({
          key: 'sample',
          name: 'sample',
        })
        .returning('*');

      await knex.table('permissions').insert({
        action: 'read',
        subject: 'User',
        role_id: role.id,
      });

      const [currentUser] = await knex
        .table('users')
        .insert({
          full_name: 'Test User',
          email: 'sample@sample.com',
          password: 'secret',
          role_id: role.id,
        })
        .returning('*');

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

      const token = createAuthTokenByUserId(currentUser.id);

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `${token}`)
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toEqual('NotFoundError');
    });
  });
});
