import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Google Docs',
  key: 'google-docs',
  baseUrl: 'https://docs.google.com/document',
  apiBaseUrl: 'https://docs.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-docs/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/google-docs/connection',
  primaryColor: '#4285F4',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
});
