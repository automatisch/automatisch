import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';

export default defineApp({
  name: 'OneDrive',
  key: 'one-drive',
  iconUrl: '{BASE_URL}/apps/onedrive/assets/favicon.svg',
  primaryColor: '1FA463',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
});
