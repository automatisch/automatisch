import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';

export default defineApp({
  name: 'Typeform',
  key: 'typeform',
  iconUrl: '{BASE_URL}/apps/typeform/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/typeform/connection',
  supportsConnections: true,
  baseUrl: 'https://typeform.com',
  apiBaseUrl: 'https://api.typeform.com',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader],
  auth,
});
