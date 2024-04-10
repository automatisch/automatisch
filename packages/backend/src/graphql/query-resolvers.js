import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';
import getDynamicData from './queries/get-dynamic-data.js';
import testConnection from './queries/test-connection.js';

const queryResolvers = {
  getAppAuthClient,
  getConnectedApps,
  getDynamicData,
  testConnection,
};

export default queryResolvers;
