import defineAuth from '../../../helpers/define-auth.js';

export default defineAuth({
  authType: 'oauth2',
  authUrl: 'https://raindrop.io/oauth/authorize',
  tokenUrl: 'https://raindrop.io/oauth/access_token',
  scope: 'read write',
  authRequestConfig: {
    response_type: 'code',
  },
  tokenRequestConfig: {
    grant_type: 'authorization_code',
  },
});
