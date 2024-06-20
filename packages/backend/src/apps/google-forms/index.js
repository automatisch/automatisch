import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Google Forms',
  key: 'google-forms',
  baseUrl: 'https://docs.google.com/forms',
  apiBaseUrl: 'https://forms.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-forms/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/google-forms/connection',
  primaryColor: '673AB7',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
