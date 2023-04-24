import defineApp from '../../helpers/define-app';
import auth from './auth';
import actions from './actions';

export default defineApp({
  name: 'ZeNotify service',
  key: 'zenotify',
  iconUrl: '{BASE_URL}/apps/zenotify/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/zenotify/connection',
  supportsConnections: true,
  baseUrl: '', 
  apiBaseUrl: 'https://zenotify-service.zekoder.brandboost.l9pro.brandboost.ai',
  primaryColor: '000000',

  auth,
  actions
});
