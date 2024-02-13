import defineApp from '../../helpers/define-app.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';
import addAuthToken from './common/add-auth-token.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Airbrake',
  key: 'airbrake',
  iconUrl: '{BASE_URL}/apps/airbrake/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/airbrake/connection',
  supportsConnections: true,
  baseUrl: 'https://www.airbrake.io',
  apiBaseUrl: '',
  primaryColor: 'f58c54',
  beforeRequest: [setBaseUrl, addAuthToken],
  auth,
  triggers,
  dynamicData,
});
