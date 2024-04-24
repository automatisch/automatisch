import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import setBaseUrl from './common/set-base-url.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'GitLab',
  key: 'gitlab',
  baseUrl: 'https://gitlab.com',
  apiBaseUrl: 'https://gitlab.com',
  iconUrl: '{BASE_URL}/apps/gitlab/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/gitlab/connection',
  primaryColor: 'FC6D26',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
