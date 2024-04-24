import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';
import dynamicFields from './dynamic-fields/index.js';

export default defineApp({
  name: 'Formatter',
  key: 'formatter',
  iconUrl: '{BASE_URL}/apps/formatter/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/formatter/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '001F52',
  actions,
  dynamicFields,
});
