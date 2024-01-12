import getApp from './queries/get-app.js';
import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getAppAuthClients from './queries/get-app-auth-clients.ee.js';
import getAppConfig from './queries/get-app-config.ee.js';
import getApps from './queries/get-apps.js';
import getAutomatischInfo from './queries/get-automatisch-info.js';
import getBillingAndUsage from './queries/get-billing-and-usage.ee.js';
import getConfig from './queries/get-config.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';
import getCurrentUser from './queries/get-current-user.js';
import getDynamicData from './queries/get-dynamic-data.js';
import getDynamicFields from './queries/get-dynamic-fields.js';
import getExecution from './queries/get-execution.js';
import getExecutionSteps from './queries/get-execution-steps.js';
import getExecutions from './queries/get-executions.js';
import getFlow from './queries/get-flow.js';
import getFlows from './queries/get-flows.js';
import getInvoices from './queries/get-invoices.ee.js';
import getNotifications from './queries/get-notifications.js';
import getPaddleInfo from './queries/get-paddle-info.ee.js';
import getPaymentPlans from './queries/get-payment-plans.ee.js';
import getPermissionCatalog from './queries/get-permission-catalog.ee.js';
import getRole from './queries/get-role.ee.js';
import getRoles from './queries/get-roles.ee.js';
import getSamlAuthProviderRoleMappings from './queries/get-saml-auth-provider-role-mappings.ee.js';
import getSamlAuthProvider from './queries/get-saml-auth-provider.ee.js';
import getStepWithTestExecutions from './queries/get-step-with-test-executions.js';
import getSubscriptionStatus from './queries/get-subscription-status.ee.js';
import getTrialStatus from './queries/get-trial-status.ee.js';
import getUser from './queries/get-user.js';
import getUsers from './queries/get-users.js';
import healthcheck from './queries/healthcheck.js';
import listSamlAuthProviders from './queries/list-saml-auth-providers.ee.js';
import testConnection from './queries/test-connection.js';

const queryResolvers = {
  getApp,
  getAppAuthClient,
  getAppAuthClients,
  getAppConfig,
  getApps,
  getAutomatischInfo,
  getBillingAndUsage,
  getConfig,
  getConnectedApps,
  getCurrentUser,
  getDynamicData,
  getDynamicFields,
  getExecution,
  getExecutions,
  getExecutionSteps,
  getFlow,
  getFlows,
  getInvoices,
  getNotifications,
  getPaddleInfo,
  getPaymentPlans,
  getPermissionCatalog,
  getRole,
  getRoles,
  getSamlAuthProvider,
  getSamlAuthProviderRoleMappings,
  getStepWithTestExecutions,
  getSubscriptionStatus,
  getTrialStatus,
  getUser,
  getUsers,
  healthcheck,
  listSamlAuthProviders,
  testConnection,
};

export default queryResolvers;
