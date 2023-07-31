import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import setBaseUrl from './common/set-base-url';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'GitLab',
  key: 'gitlab',
  baseUrl: 'https://gitlab.com',
  apiBaseUrl: 'https://gitlab.com',
  iconUrl: '{BASE_URL}/apps/gitlab/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/gitlab/connection',
  primaryColor: 'FC6D26',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
