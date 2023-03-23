import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import actions from './actions';
import auth from './auth';

export default defineApp({
  name: 'Spotify',
  key: 'spotify',
  iconUrl: '{BASE_URL}/apps/spotify/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/spotify/connection',
  supportsConnections: true,
  baseUrl: 'https://spotify.com',
  apiBaseUrl: 'https://api.spotify.com',
  primaryColor: '000000',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
});
