import { OAUTH_ENDPOINTS } from './constants.js';

const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get(
    OAUTH_ENDPOINTS.OPENID_PROFILE
  );
  return currentUser;
};

export default getCurrentUser;
