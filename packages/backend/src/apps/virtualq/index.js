import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'VirtualQ',
  key: 'virtualq',
  iconUrl: '{BASE_URL}/apps/virtualq/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/virtualq/connection',
  supportsConnections: true,
  baseUrl: 'https://www.virtualq.tech',
  apiBaseUrl: 'https://api.virtualq.tech/api/',
  primaryColor: '#2E3D59',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
  dynamicFields,
});
