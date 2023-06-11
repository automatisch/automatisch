import defineApp from '../../helpers/define-app';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';

export default defineApp({
  name: 'Vkontakte',
  key: 'vkontakte',
  iconUrl: '{BASE_URL}/apps/vkontakte/assets/favicon.svg',
  authDocUrl: '',
  supportsConnections: true,
  baseUrl: 'https://vk.com',
  apiBaseUrl: 'https://api.vk.com',
  primaryColor: '0077ff',
  beforeRequest: [],
  auth,
  triggers,
  actions,
});
