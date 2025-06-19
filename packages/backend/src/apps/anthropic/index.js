import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import addAnthropicVersionHeader from './common/add-anthropic-version-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Anthropic',
  key: 'anthropic',
  baseUrl: 'https://anthropic.com',
  apiBaseUrl: 'https://api.anthropic.com',
  iconUrl: '{BASE_URL}/apps/anthropic/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/anthropic/connection',
  primaryColor: '#181818',
  supportsConnections: true,
  beforeRequest: [addAuthHeader, addAnthropicVersionHeader],
  auth,
  actions,
  dynamicData,
});
