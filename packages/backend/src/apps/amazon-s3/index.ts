import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';

export default defineApp({
  name: 'Amazon S3',
  key: 'amazon-s3',
  baseUrl: '',
  apiBaseUrl: 'https://s3.amazonaws.com',
  iconUrl: '{BASE_URL}/apps/amazon-s3/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/amazon-s3/connection',
  primaryColor: '7B1D13',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
});
