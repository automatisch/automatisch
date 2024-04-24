import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Typeform',
  key: 'typeform',
  iconUrl: '{BASE_URL}/apps/typeform/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/typeform/connection',
  supportsConnections: true,
  baseUrl: 'https://typeform.com',
  apiBaseUrl: 'https://api.typeform.com',
  primaryColor: '262627',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
