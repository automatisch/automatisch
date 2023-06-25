import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  const instanceUrl = $.auth.data.instanceUrl as string;
  const password = $.auth.data.password as string;
  const siteUrl = $.auth.data.site_url as string;
  const url = $.auth.data.url as string;
  const userLogin = $.auth.data.user_login as string;

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
