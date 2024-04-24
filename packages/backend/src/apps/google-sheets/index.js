import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'Google Sheets',
  key: 'google-sheets',
  baseUrl: 'https://docs.google.com/spreadsheets',
  apiBaseUrl: 'https://sheets.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-sheets/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/google-sheets/connection',
  primaryColor: '0F9D58',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  actions,
  dynamicData,
  dynamicFields,
});
