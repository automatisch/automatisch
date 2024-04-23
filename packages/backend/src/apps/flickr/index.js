import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Flickr',
  key: 'flickr',
  iconUrl: '{BASE_URL}/apps/flickr/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/flickr/connection',
  docUrl: 'https://automatisch.io/docs/flickr',
  primaryColor: '000000',
  supportsConnections: true,
  baseUrl: 'https://www.flickr.com/',
  apiBaseUrl: 'https://www.flickr.com/services',
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
