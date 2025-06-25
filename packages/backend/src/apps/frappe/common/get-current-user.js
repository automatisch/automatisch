import { OAUTH_ENDPOINTS } from "./constants.js";
import { getFrappeSiteURL } from "./utils.js";

const getCurrentUser = async ($) => {
    const siteUrl = getFrappeSiteURL($);
    const response = await $.http.get(`${siteUrl}${OAUTH_ENDPOINTS.OPENID_PROFILE}`);
    const currentUser = response.data;

    return currentUser;
};

export default getCurrentUser;
