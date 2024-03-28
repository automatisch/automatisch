import getApp from './queries/get-app.js';
import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';
import getDynamicData from './queries/get-dynamic-data.js';
import getStepWithTestExecutions from './queries/get-step-with-test-executions.js';
import testConnection from './queries/test-connection.js';

const queryResolvers = {
  getApp,
  getAppAuthClient,
  getConnectedApps,
  getDynamicData,
  getStepWithTestExecutions,
  testConnection,
};

export default queryResolvers;
