import defineApp from '../../helpers/define-app';
import actions from './actions';
import dynamicFields from './dynamic-fields';

export default defineApp({
  name: 'Formatter',
  key: 'formatter',
  iconUrl: '{BASE_URL}/apps/formatter/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/formatter/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '001F52',
  actions,
  dynamicFields,
});
