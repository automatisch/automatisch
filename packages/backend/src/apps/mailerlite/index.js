import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'MailerLite',
  key: 'mailerlite',
  iconUrl: '{BASE_URL}/apps/mailerlite/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/mailerlite/connection',
  supportsConnections: true,
  baseUrl: 'https://www.mailerlite.com',
  apiBaseUrl: 'https://connect.mailerlite.com/api',
  primaryColor: '09C269',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
