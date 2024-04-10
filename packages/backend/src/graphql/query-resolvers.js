import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';

const queryResolvers = {
  getAppAuthClient,
  getConnectedApps,
};

export default queryResolvers;
