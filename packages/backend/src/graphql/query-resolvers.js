import getApp from './queries/get-app.js';
import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getAppAuthClients from './queries/get-app-auth-clients.ee.js';
import getBillingAndUsage from './queries/get-billing-and-usage.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';
import getDynamicData from './queries/get-dynamic-data.js';
import testConnection from './queries/test-connection.js';

const queryResolvers = {
  getApp,
  getAppAuthClient,
  getAppAuthClients,
  getBillingAndUsage,
  getConnectedApps,
  getDynamicData,
  testConnection,
};

export default queryResolvers;
