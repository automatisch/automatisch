import getApp from './queries/get-app.js';
import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getAppAuthClients from './queries/get-app-auth-clients.ee.js';
import getBillingAndUsage from './queries/get-billing-and-usage.ee.js';
import getConfig from './queries/get-config.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';
import getCurrentUser from './queries/get-current-user.js';
import getDynamicData from './queries/get-dynamic-data.js';
import getDynamicFields from './queries/get-dynamic-fields.js';
import getFlow from './queries/get-flow.js';
import getFlows from './queries/get-flows.js';
import getNotifications from './queries/get-notifications.js';
import getPermissionCatalog from './queries/get-permission-catalog.ee.js';
import getSamlAuthProviderRoleMappings from './queries/get-saml-auth-provider-role-mappings.ee.js';
import getSamlAuthProvider from './queries/get-saml-auth-provider.ee.js';
import getStepWithTestExecutions from './queries/get-step-with-test-executions.js';
import getSubscriptionStatus from './queries/get-subscription-status.ee.js';
import getTrialStatus from './queries/get-trial-status.ee.js';
import getUser from './queries/get-user.js';
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
  getCurrentUser,
  getDynamicData,
  getDynamicFields,
  getFlow,
  getFlows,
  getNotifications,
  getPermissionCatalog,
  getSamlAuthProvider,
  getSamlAuthProviderRoleMappings,
  getStepWithTestExecutions,
  getSubscriptionStatus,
  getTrialStatus,
  getUser,
  getUsers,
  listSamlAuthProviders,
  testConnection,
};

export default queryResolvers;
