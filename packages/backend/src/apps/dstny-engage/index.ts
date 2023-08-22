import defineApp from '../../helpers/define-app';
import auth from './auth';
import addAuthHeader from './common/add-auth-headers';

export default defineApp({
  name: 'Dstny Engage',
  key: 'dstny-engage',
  iconUrl: '{BASE_URL}/apps/dstny-engage/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/dstnyengage/connection',
  supportsConnections: true,
  baseUrl: 'https://dstnyengage.com',
  apiBaseUrl: 'https://erp.alpha.dev.tactful.ai/erp',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader],
  auth,
});
