import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Salesforce',
  key: 'salesforce',
  iconUrl: '{BASE_URL}/apps/salesforce/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/connections/salesforce',
  supportsConnections: true,
  baseUrl: 'https://salesforce.com',
  apiBaseUrl: '',
  primaryColor: '00A1E0',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
