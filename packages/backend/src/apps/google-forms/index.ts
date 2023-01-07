import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Google Forms',
  key: 'google-forms',
  baseUrl: 'https://docs.google.com/forms',
  apiBaseUrl: 'https://forms.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-forms/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/google-forms/connection',
  primaryColor: '673AB7',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
