import getCurrentAccount from '../common/get-current-account.js';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );

  const redirectUrl = oauthRedirectUrlField.value;

  const params = {
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUrl,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
  };

  const { data: verifiedCredentials } = await $.http.post(
    '/oauth2/token',
    null,
    { params }
  );

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    scope: scope,
    token_type: tokenType,
    account_id: accountId,
    team_id: teamId,
    id_token: idToken,
    uid,
  } = verifiedCredentials;

  await $.auth.set({
    accessToken,
    refreshToken,
    expiresIn,
    scope,
    tokenType,
    accountId,
    teamId,
    idToken,
    uid,
  });

  const account = await getCurrentAccount($);

  await $.auth.set({
    accountId: account.account_id,
    name: {
      givenName: account.name.given_name,
      surname: account.name.surname,
      familiarName: account.name.familiar_name,
      displayName: account.name.display_name,
      abbreviatedName: account.name.abbreviated_name,
    },
    email: account.email,
    emailVerified: account.email_verified,
    disabled: account.disabled,
    country: account.country,
    locale: account.locale,
    referralLink: account.referral_link,
    isPaired: account.is_paired,
    accountType: {
      '.tag': account.account_type['.tag'],
    },
    rootInfo: {
      '.tag': account.root_info['.tag'],
      rootNamespaceId: account.root_info.root_namespace_id,
      homeNamespaceId: account.root_info.home_namespace_id,
    },
    screenName: `${account.name.display_name} - ${account.email}`,
  });
};

export default verifyCredentials;
