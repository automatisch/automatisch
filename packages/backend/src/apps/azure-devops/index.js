import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';
import auth from './auth/index.js';
import addAuthHeader from './common/add-auth-header.js';
import setEndpoint from './common/set-endpoint.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';
export default defineApp({
  name: 'Azure DevOps',
  key: 'azure-devops',
  iconUrl: '{BASE_URL}/apps/azure-devops/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/azure-devops/connection',
  supportsConnections: true,
  baseUrl: 'https://dev.azure.com',
  apiBaseUrl: 'https://dev.azure.com',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader, setEndpoint],
  auth,
  actions,
  dynamicData,
  dynamicFields,
});
