import getApp from './queries/get-app';
import getApps from './queries/get-apps';
import getAutomatischInfo from './queries/get-automatisch-info';
import getBillingAndUsage from './queries/get-billing-and-usage.ee';
import getConnectedApps from './queries/get-connected-apps';
import getCurrentUser from './queries/get-current-user';
import getDynamicData from './queries/get-dynamic-data';
import getDynamicFields from './queries/get-dynamic-fields';
import getExecution from './queries/get-execution';
import getExecutionSteps from './queries/get-execution-steps';
import getExecutions from './queries/get-executions';
import getFlow from './queries/get-flow';
import getFlows from './queries/get-flows';
import getUser from './queries/get-user';
import getUsers from './queries/get-users';
import getInvoices from './queries/get-invoices.ee';
import getPaddleInfo from './queries/get-paddle-info.ee';
import getPaymentPlans from './queries/get-payment-plans.ee';
import getPermissionCatalog from './queries/get-permission-catalog.ee';
import getRole from './queries/get-role.ee';
import getRoles from './queries/get-roles.ee';
import listSamlAuthProviders from './queries/list-saml-auth-providers.ee';
import getStepWithTestExecutions from './queries/get-step-with-test-executions';
import getSubscriptionStatus from './queries/get-subscription-status.ee';
import getTrialStatus from './queries/get-trial-status.ee';
import healthcheck from './queries/healthcheck';
import testConnection from './queries/test-connection';

const queryResolvers = {
  getApp,
  getApps,
  getAutomatischInfo,
  getBillingAndUsage,
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
  getPaddleInfo,
  getPaymentPlans,
  getPermissionCatalog,
  getRole,
  getRoles,
  listSamlAuthProviders,
  getStepWithTestExecutions,
  getSubscriptionStatus,
  getTrialStatus,
  getUser,
  getUsers,
  healthcheck,
  testConnection,
};

export default queryResolvers;
