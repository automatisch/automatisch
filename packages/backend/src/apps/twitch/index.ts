import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';

export default defineApp({
  name: 'Twitch',
  key: 'twitch',
  baseUrl: 'https://www.twitch.tv',
  apiBaseUrl: 'https://api.twitch.tv',
  iconUrl: '{BASE_URL}/apps/twitch/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/twitch/connection',
  primaryColor: '5C16C5',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
});
