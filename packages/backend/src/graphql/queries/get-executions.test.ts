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
import { createExecution } from '../../../test/factories/execution';
import { createExecutionStep } from '../../../test/factories/execution-step';

describe('graphQL getExecutions query', () => {
  const query = `
    query {
      getExecutions(limit: 10, offset: 0) {
        pageInfo {
          currentPage
          totalPages
        }
        edges {
          node {
            id
            testRun
            createdAt
            updatedAt
            status
            flow {
              id
              name
              active
              steps {
                iconUrl
              }
            }
          }
        }
      }
    }
  `;

  const invalidToken = 'invalid-token';

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

    describe('and with correct permission', () => {
      let role,
        currentUser,
        anotherUser,
        token,
        flowOne,
        stepOneForFlowOne,
        stepTwoForFlowOne,
        executionOne,
        flowTwo,
        stepOneForFlowTwo,
        stepTwoForFlowTwo,
        executionTwo,
        flowThree,
        stepOneForFlowThree,
        stepTwoForFlowThree,
        executionThree,
        expectedResponseForExecutionOne,
        expectedResponseForExecutionTwo,
        expectedResponseForExecutionThree;

      beforeEach(async () => {
        role = await createRole({
          key: 'sample',
          name: 'sample',
        });

        currentUser = await createUser({
          roleId: role.id,
          fullName: 'Current User',
        });

        anotherUser = await createUser();

        token = createAuthTokenByUserId(currentUser.id);

        flowOne = await createFlow({
          userId: currentUser.id,
        });

        stepOneForFlowOne = await createStep({
          flowId: flowOne.id,
        });

        stepTwoForFlowOne = await createStep({
          flowId: flowOne.id,
        });

        executionOne = await createExecution({
          flowId: flowOne.id,
        });

        await createExecutionStep({
          executionId: executionOne.id,
          stepId: stepOneForFlowOne.id,
          status: 'success',
        });

        await createExecutionStep({
          executionId: executionOne.id,
          stepId: stepTwoForFlowOne.id,
          status: 'success',
        });

        flowTwo = await createFlow({
          userId: currentUser.id,
        });

        stepOneForFlowTwo = await createStep({
          flowId: flowTwo.id,
        });

        stepTwoForFlowTwo = await createStep({
          flowId: flowTwo.id,
        });

        executionTwo = await createExecution({
          flowId: flowTwo.id,
        });

        await createExecutionStep({
          executionId: executionTwo.id,
          stepId: stepOneForFlowTwo.id,
          status: 'success',
        });

        await createExecutionStep({
          executionId: executionTwo.id,
          stepId: stepTwoForFlowTwo.id,
          status: 'failure',
        });

        flowThree = await createFlow({
          userId: anotherUser.id,
        });

        stepOneForFlowThree = await createStep({
          flowId: flowThree.id,
        });

        stepTwoForFlowThree = await createStep({
          flowId: flowThree.id,
        });

        executionThree = await createExecution({
          flowId: flowThree.id,
        });

        await createExecutionStep({
          executionId: executionThree.id,
          stepId: stepOneForFlowThree.id,
          status: 'success',
        });

        await createExecutionStep({
          executionId: executionThree.id,
          stepId: stepTwoForFlowThree.id,
          status: 'failure',
        });

        expectedResponseForExecutionOne = {
          node: {
            createdAt: executionOne.createdAt.getTime().toString(),
            flow: {
              active: flowOne.active,
              id: flowOne.id,
              name: flowOne.name,
              steps: [
                {
                  iconUrl: `${appConfig.baseUrl}/apps/${stepOneForFlowOne.appKey}/assets/favicon.svg`,
                },
                {
                  iconUrl: `${appConfig.baseUrl}/apps/${stepTwoForFlowOne.appKey}/assets/favicon.svg`,
                },
              ],
            },
            id: executionOne.id,
            status: 'success',
            testRun: executionOne.testRun,
            updatedAt: executionOne.updatedAt.getTime().toString(),
          },
        };

        expectedResponseForExecutionTwo = {
          node: {
            createdAt: executionTwo.createdAt.getTime().toString(),
            flow: {
              active: flowTwo.active,
              id: flowTwo.id,
              name: flowTwo.name,
              steps: [
                {
                  iconUrl: `${appConfig.baseUrl}/apps/${stepTwoForFlowTwo.appKey}/assets/favicon.svg`,
                },
                {
                  iconUrl: `${appConfig.baseUrl}/apps/${stepTwoForFlowTwo.appKey}/assets/favicon.svg`,
                },
              ],
            },
            id: executionTwo.id,
            status: 'failure',
            testRun: executionTwo.testRun,
            updatedAt: executionTwo.updatedAt.getTime().toString(),
          },
        };

        expectedResponseForExecutionThree = {
          node: {
            createdAt: executionThree.createdAt.getTime().toString(),
            flow: {
              active: flowThree.active,
              id: flowThree.id,
              name: flowThree.name,
              steps: [
                {
                  iconUrl: `${appConfig.baseUrl}/apps/${stepOneForFlowThree.appKey}/assets/favicon.svg`,
                },
                {
                  iconUrl: `${appConfig.baseUrl}/apps/${stepTwoForFlowThree.appKey}/assets/favicon.svg`,
                },
              ],
            },
            id: executionThree.id,
            status: 'failure',
            testRun: executionThree.testRun,
            updatedAt: executionThree.updatedAt.getTime().toString(),
          },
        };
      });

      describe('and with isCreator condition', () => {
        beforeEach(async () => {
          await createPermission({
            action: 'read',
            subject: 'Execution',
            roleId: role.id,
            conditions: ['isCreator'],
          });
        });

        it('should return executions data of the current user', async () => {
          const response = await request(app)
            .post('/graphql')
            .set('Authorization', token)
            .send({ query })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getExecutions: {
                edges: [
                  expectedResponseForExecutionTwo,
                  expectedResponseForExecutionOne,
                ],
                pageInfo: { currentPage: 1, totalPages: 1 },
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });
      });

      describe('and without isCreator condition', () => {
        beforeEach(async () => {
          await createPermission({
            action: 'read',
            subject: 'Execution',
            roleId: role.id,
            conditions: [],
          });
        });

        it('should return executions data of all users', async () => {
          const response = await request(app)
            .post('/graphql')
            .set('Authorization', token)
            .send({ query })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getExecutions: {
                edges: [
                  expectedResponseForExecutionThree,
                  expectedResponseForExecutionTwo,
                  expectedResponseForExecutionOne,
                ],
                pageInfo: { currentPage: 1, totalPages: 1 },
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });
      });

      describe('and with filters', () => {
        beforeEach(async () => {
          await createPermission({
            action: 'read',
            subject: 'Execution',
            roleId: role.id,
            conditions: [],
          });
        });

        it('should return executions data for the specified flow', async () => {
          const query = `
            query {
              getExecutions(limit: 10, offset: 0, filters: { flowId: "${flowOne.id}" }) {
                pageInfo {
                  currentPage
                  totalPages
                }
                edges {
                  node {
                    id
                    testRun
                    createdAt
                    updatedAt
                    status
                    flow {
                      id
                      name
                      active
                      steps {
                        iconUrl
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await request(app)
            .post('/graphql')
            .set('Authorization', token)
            .send({ query })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getExecutions: {
                edges: [expectedResponseForExecutionOne],
                pageInfo: { currentPage: 1, totalPages: 1 },
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });

        it('should return only executions data with success status', async () => {
          const query = `
            query {
              getExecutions(limit: 10, offset: 0, filters: { status: "success" }) {
                pageInfo {
                  currentPage
                  totalPages
                }
                edges {
                  node {
                    id
                    testRun
                    createdAt
                    updatedAt
                    status
                    flow {
                      id
                      name
                      active
                      steps {
                        iconUrl
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await request(app)
            .post('/graphql')
            .set('Authorization', token)
            .send({ query })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getExecutions: {
                edges: [expectedResponseForExecutionOne],
                pageInfo: { currentPage: 1, totalPages: 1 },
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });

        it('should return only executions data within date range', async () => {
          const createdAtFrom = executionOne.createdAt.getTime().toString();

          const createdAtTo = executionOne.createdAt.getTime().toString();

          const query = `
            query {
              getExecutions(limit: 10, offset: 0, filters: { createdAt: { from: "${createdAtFrom}", to: "${createdAtTo}" }}) {
                pageInfo {
                  currentPage
                  totalPages
                }
                edges {
                  node {
                    id
                    testRun
                    createdAt
                    updatedAt
                    status
                    flow {
                      id
                      name
                      active
                      steps {
                        iconUrl
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await request(app)
            .post('/graphql')
            .set('Authorization', token)
            .send({ query })
            .expect(200);

          const expectedResponsePayload = {
            data: {
              getExecutions: {
                edges: [expectedResponseForExecutionOne],
                pageInfo: { currentPage: 1, totalPages: 1 },
              },
            },
          };

          expect(response.body).toEqual(expectedResponsePayload);
        });
      });
    });
  });
});
