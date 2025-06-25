import { getFrappeSiteURL } from "src/apps/frappe/common/utils";

const verifyCredentials = async ($) => {
  const instanceUrl = $.auth.data.instanceUrl;
  const password = $.auth.data.password;
  const siteUrl = getFrappeSiteURL($);
  const url = $.auth.data.url;
  const userLogin = $.auth.data.user_login;

  if (!password) {
    throw new Error('Failed while authorizing!');
  }

  await $.auth.set({
    screenName: `${userLogin} @ ${siteUrl}`,
    instanceUrl,
    password,
    siteUrl,
    url,
    userLogin,
  });
};

export default verifyCredentials;
