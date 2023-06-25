import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import setBaseUrl from './common/set-base-url';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'WordPress',
  key: 'wordpress',
  iconUrl: '{BASE_URL}/apps/wordpress/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/wordpress/connection',
  supportsConnections: true,
  baseUrl: 'https://wordpress.com',
  apiBaseUrl: '',
  primaryColor: '464342',
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
