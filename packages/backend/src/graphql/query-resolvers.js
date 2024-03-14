import getApp from './queries/get-app.js';
import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getAppAuthClients from './queries/get-app-auth-clients.ee.js';
import getBillingAndUsage from './queries/get-billing-and-usage.ee.js';
import getConfig from './queries/get-config.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';
import getDynamicData from './queries/get-dynamic-data.js';
import getDynamicFields from './queries/get-dynamic-fields.js';
import getFlow from './queries/get-flow.js';
import getFlows from './queries/get-flows.js';
import getNotifications from './queries/get-notifications.js';
import getSamlAuthProviderRoleMappings from './queries/get-saml-auth-provider-role-mappings.ee.js';
import getStepWithTestExecutions from './queries/get-step-with-test-executions.js';
import getTrialStatus from './queries/get-trial-status.ee.js';
import getUsers from './queries/get-users.js';
import listSamlAuthProviders from './queries/list-saml-auth-providers.ee.js';
import testConnection from './queries/test-connection.js';

const queryResolvers = {
  getApp,
  getAppAuthClient,
  getAppAuthClients,
  getBillingAndUsage,
  getConfig,
  getConnectedApps,
  getDynamicData,
  getDynamicFields,
  getFlow,
  getFlows,
  getNotifications,
  getSamlAuthProviderRoleMappings,
  getStepWithTestExecutions,
  getTrialStatus,
  getUsers,
  listSamlAuthProviders,
  testConnection,
};

export default queryResolvers;
