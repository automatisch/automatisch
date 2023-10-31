// @ts-nocheck
import request from 'supertest';
import app from '../../app';
import appConfig from '../../config/app';
import createAuthTokenByUserId from '../../helpers/create-auth-token-by-user-id';
import { createRole } from '../../../test/factories/role';
import { createPermission } from '../../../test/factories/permission';
import { createUser } from '../../../test/factories/user';
import { createFlow } from '../../../test/factories/flow';
import { createStep } from '../../../test/factories/step';
import { createConnection } from '../../../test/factories/connection';

describe('graphQL getFlow query', () => {
  const query = (flowId) => {
    return `
      query {
        getFlow(id: "${flowId}") {
          id
          name
          active
          status
          steps {
            id
            type
            key
            appKey
            iconUrl
            webhookUrl
            status
            position
            connection {
              id
              verified
              createdAt
            }
            parameters
          }
        }
      }
    `;
  };

  describe('with unauthenticated user', () => {
    it('should throw not authorized error', async () => {
      const invalidToken = 'invalid-token';
      const flow = await createFlow();

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', invalidToken)
        .send({ query: query(flow.id) })
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
        const flow = await createFlow();

        const response = await request(app)
          .post('/graphql')
          .set('Authorization', token)
          .send({ query: query(flow.id) })
          .expect(200);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toEqual('Not authorized!');
      });
    });

    describe('and with correct permission', () => {
      let currentUser, currentUserRole, currentUserFlow;

      beforeEach(async () => {
        currentUserRole = await createRole();
        currentUser = await createUser({ roleId: currentUserRole.id });
        currentUserFlow = await createFlow({ userId: currentUser.id });
      });

      describe('and with isCreator condition', () => {
        it('should return executions data of the current user', async () => {
          await createPermission({
            action: 'read',
            subject: 'Flow',
            roleId: currentUserRole.id,
            conditions: ['isCreator'],
          });

          const triggerStep = await createStep({
            flowId: currentUserFlow.id,
            type: 'trigger',
            key: 'catchRawWebhook',
            webhookPath: `/webhooks/flows/${currentUserFlow.id}`,
          });

          const actionConnection = await createConnection({
            userId: currentUser.id,
            formattedData: {
              screenName: 'Test',
              authenticationKey: 'test key',
            },
          });

          const actionStep = await createStep({
            flowId: currentUserFlow.id,
            type: 'action',
            connectionId: actionConnection.id,
            key: 'translateText',
          });

          const token = createAuthTokenByUserId(currentUser.id);

          const response = await request(app)
            .post('/graphql')
            .set('Authorization', token)
            .send({ query: query(currentUserFlow.id) })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getFlow: {
                active: currentUserFlow.active,
                id: currentUserFlow.id,
                name: currentUserFlow.name,
                status: 'draft',
                steps: [
                  {
                    appKey: triggerStep.appKey,
                    connection: null,
                    iconUrl: `${appConfig.baseUrl}/apps/${triggerStep.appKey}/assets/favicon.svg`,
                    id: triggerStep.id,
                    key: 'catchRawWebhook',
                    parameters: {},
                    position: 1,
                    status: triggerStep.status,
                    type: 'trigger',
                    webhookUrl: `${appConfig.baseUrl}/webhooks/flows/${currentUserFlow.id}`,
                  },
                  {
                    appKey: actionStep.appKey,
                    connection: {
                      createdAt: actionConnection.createdAt
                        .getTime()
                        .toString(),
                      id: actionConnection.id,
                      verified: actionConnection.verified,
                    },
                    iconUrl: `${appConfig.baseUrl}/apps/${actionStep.appKey}/assets/favicon.svg`,
                    id: actionStep.id,
                    key: 'translateText',
                    parameters: {},
                    position: 1,
                    status: actionStep.status,
                    type: 'action',
                    webhookUrl: 'http://localhost:3000/null',
                  },
                ],
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });
      });

      describe('and without isCreator condition', () => {
        it('should return executions data of all users', async () => {
          await createPermission({
            action: 'read',
            subject: 'Flow',
            roleId: currentUserRole.id,
            conditions: [],
          });

          const anotherUser = await createUser();
          const anotherUserFlow = await createFlow({ userId: anotherUser.id });

          const triggerStep = await createStep({
            flowId: anotherUserFlow.id,
            type: 'trigger',
            key: 'catchRawWebhook',
            webhookPath: `/webhooks/flows/${anotherUserFlow.id}`,
          });

          const actionConnection = await createConnection({
            userId: anotherUser.id,
            formattedData: {
              screenName: 'Test',
              authenticationKey: 'test key',
            },
          });

          const actionStep = await createStep({
            flowId: anotherUserFlow.id,
            type: 'action',
            connectionId: actionConnection.id,
            key: 'translateText',
          });

          const token = createAuthTokenByUserId(currentUser.id);

          const response = await request(app)
            .post('/graphql')
            .set('Authorization', token)
            .send({ query: query(anotherUserFlow.id) })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getFlow: {
                active: anotherUserFlow.active,
                id: anotherUserFlow.id,
                name: anotherUserFlow.name,
                status: 'draft',
                steps: [
                  {
                    appKey: triggerStep.appKey,
                    connection: null,
                    iconUrl: `${appConfig.baseUrl}/apps/${triggerStep.appKey}/assets/favicon.svg`,
                    id: triggerStep.id,
                    key: 'catchRawWebhook',
                    parameters: {},
                    position: 1,
                    status: triggerStep.status,
                    type: 'trigger',
                    webhookUrl: `${appConfig.baseUrl}/webhooks/flows/${anotherUserFlow.id}`,
                  },
                  {
                    appKey: actionStep.appKey,
                    connection: {
                      createdAt: actionConnection.createdAt
                        .getTime()
                        .toString(),
                      id: actionConnection.id,
                      verified: actionConnection.verified,
                    },
                    iconUrl: `${appConfig.baseUrl}/apps/${actionStep.appKey}/assets/favicon.svg`,
                    id: actionStep.id,
                    key: 'translateText',
                    parameters: {},
                    position: 1,
                    status: actionStep.status,
                    type: 'action',
                    webhookUrl: 'http://localhost:3000/null',
                  },
                ],
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });
      });
    });
  });
});
