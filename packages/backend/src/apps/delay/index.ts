import defineApp from '../../helpers/define-app';
import actions from './actions';

export default defineApp({
  name: 'Delay',
  key: 'delay',
  iconUrl: '{BASE_URL}/apps/delay/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/delay/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '001F52',
  actions,
});
