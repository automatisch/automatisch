import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Gitlab',
  key: 'gitlab',
  baseUrl: 'https://gitlab.com',
  apiBaseUrl: 'https://gitlab.com/api/v4',
  iconUrl: '{BASE_URL}/apps/gitlab/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/gitlab/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
