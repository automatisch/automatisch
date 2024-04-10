import getAppAuthClient from './queries/get-app-auth-client.ee.js';
import getConnectedApps from './queries/get-connected-apps.js';
import getDynamicData from './queries/get-dynamic-data.js';

const queryResolvers = {
  getAppAuthClient,
  getConnectedApps,
  getDynamicData,
};

export default queryResolvers;
