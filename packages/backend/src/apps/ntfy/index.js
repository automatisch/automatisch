import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Ntfy',
  key: 'ntfy',
  iconUrl: '{BASE_URL}/apps/ntfy/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/ntfy/connection',
  supportsConnections: true,
  baseUrl: 'https://ntfy.sh',
  apiBaseUrl: 'https://ntfy.sh',
  primaryColor: '56bda8',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
