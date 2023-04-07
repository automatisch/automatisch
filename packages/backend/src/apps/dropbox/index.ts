import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'Dropbox',
  key: 'dropbox',
  iconUrl: '{BASE_URL}/apps/dropbox/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/dropbox/connection',
  supportsConnections: true,
  baseUrl: 'https://dropbox.com',
  apiBaseUrl: 'https://api.dropboxapi.com',
  primaryColor: '0061ff',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
