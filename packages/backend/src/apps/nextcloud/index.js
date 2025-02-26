import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'NextCloud',
  key: 'nextcloud',
  iconUrl: '{BASE_URL}/apps/nextcloud/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/nextcloud/connection',
  supportsConnections: true,
  primaryColor: '000000',
  beforeRequest: [setBaseUrl, addAuthHeader],

  auth,
  triggers,
});
