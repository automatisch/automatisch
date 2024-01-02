import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import setBaseUrl from './common/set-base-url';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Self-hosted LLM',
  key: 'self-hosted-llm',
  baseUrl: '',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/self-hosted-llm/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/self-hosted-llm/connection',
  primaryColor: '000000',
  supportsConnections: true,
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
  dynamicData,
});
