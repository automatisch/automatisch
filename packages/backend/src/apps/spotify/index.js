import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import actions from './actions/index.js';
import auth from './auth/index.js';

export default defineApp({
  name: 'Spotify',
  key: 'spotify',
  iconUrl: '{BASE_URL}/apps/spotify/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/spotify/connection',
  supportsConnections: true,
  baseUrl: 'https://spotify.com',
  apiBaseUrl: 'https://api.spotify.com',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
