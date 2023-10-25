import request, { Test } from 'supertest';
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
import {
  IRole,
  IUser,
  IExecution,
  IFlow,
  IExecutionStep,
  IStep,
} from '@automatisch/types';

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

    describe('and with correct permission and isCreator condition', () => {
      let role: IRole,
        currentUser: IUser,
        anotherUser: IUser,
        token: string,
        requestObject: Test,
        flowOne: IFlow,
        stepOneForFlowOne: IStep,
        stepTwoForFlowOne: IStep,
        executionOne: IExecution,
        executionStepOneForExecutionOne: IExecutionStep,
        executionStepTwoForExecutionOne: IExecutionStep,
        flowTwo: IFlow,
        stepOneForFlowTwo: IStep,
        stepTwoForFlowTwo: IStep,
        executionTwo: IExecution,
        executionStepOneForExecutionTwo: IExecutionStep,
        executionStepTwoForExecutionTwo: IExecutionStep;

      beforeEach(async () => {
        role = await createRole({
          key: 'sample',
          name: 'sample',
        });

        await createPermission({
          action: 'read',
          subject: 'Execution',
          roleId: role.id,
          conditions: ['isCreator'],
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

        executionStepOneForExecutionOne = await createExecutionStep({
          executionId: executionOne.id,
          stepId: stepOneForFlowOne.id,
          status: 'success',
        });

        executionStepTwoForExecutionOne = await createExecutionStep({
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

        executionStepOneForExecutionTwo = await createExecutionStep({
          executionId: executionTwo.id,
          stepId: stepOneForFlowTwo.id,
          status: 'success',
        });

        executionStepTwoForExecutionTwo = await createExecutionStep({
          executionId: executionTwo.id,
          stepId: stepTwoForFlowTwo.id,
          status: 'failure',
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
                {
                  node: {
                    createdAt: (flowTwo.createdAt as Date).getTime().toString(),
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
                    updatedAt: (executionTwo.updatedAt as Date)
                      .getTime()
                      .toString(),
                  },
                },
                {
                  node: {
                    createdAt: (flowOne.createdAt as Date).getTime().toString(),
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
                    updatedAt: (executionOne.updatedAt as Date)
                      .getTime()
                      .toString(),
                  },
                },
              ],
              pageInfo: { currentPage: 1, totalPages: 1 },
            },
          },
        };

        expect(response.body).toEqual(expectedResponsePayload);
      });

      // it('should not return users data with password', async () => {
      //   const query = `
      //     query {
      //       getUsers(limit: 10, offset: 0) {
      //         pageInfo {
      //           currentPage
      //           totalPages
      //         }
      //         totalCount
      //         edges {
      //           node {
      //             id
      //             fullName
      //             password
      //           }
      //         }
      //       }
      //     }
      //   `;

      //   const response = await requestObject.send({ query }).expect(400);

      //   expect(response.body.errors).toBeDefined();
      //   expect(response.body.errors[0].message).toEqual(
      //     'Cannot query field "password" on type "User".'
      //   );
      // });
    });
  });
});
