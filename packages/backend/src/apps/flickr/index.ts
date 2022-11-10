import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Flickr',
  key: 'flickr',
  iconUrl: '{BASE_URL}/apps/flickr/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/flickr/connection',
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
