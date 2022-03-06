import getApps from './queries/get-apps';
import getApp from './queries/get-app';
import getConnectedApps from './queries/get-connected-apps';
import getAppConnections from './queries/get-app-connections';
import testConnection from './queries/test-connection';
import getFlow from './queries/get-flow';
import getFlows from './queries/get-flows';
import getStepWithTestExecutions from './queries/get-step-with-test-executions';

const queryResolvers = {
  getApps,
  getApp,
  getConnectedApps,
  getAppConnections,
  testConnection,
  getFlow,
  getFlows,
  getStepWithTestExecutions,
};

export default queryResolvers;
