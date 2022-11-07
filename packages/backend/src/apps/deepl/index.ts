import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'DeepL',
  key: 'deepl',
  iconUrl: '{BASE_URL}/apps/deepl/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/deepl/connection',
  supportsConnections: true,
  baseUrl: 'https://deepl.com',
  apiBaseUrl: 'https://api.deepl.com',
  primaryColor: '0d2d45',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
