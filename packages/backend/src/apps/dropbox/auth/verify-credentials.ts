import { IGlobalVariable, IField } from '@automatisch/types';
import getCurrentAccount from '../common/get-current-account';

type TAccount = {
  account_id: string,
  name: {
    given_name: string,
    surname: string,
    familiar_name: string,
    display_name: string,
    abbreviated_name: string,
  },
  email: string,
  email_verified: boolean,
  disabled: boolean,
  country: string,
  locale: string,
  referral_link: string,
  is_paired: boolean,
  account_type: {
    ".tag": string,
  },
  root_info: {
    ".tag": string,
    root_namespace_id: string,
    home_namespace_id: string,
  },
}

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUrl = oauthRedirectUrlField.value as string;
  const params = {
    client_id: $.auth.data.clientId as string,
    redirect_uri: redirectUrl,
    client_secret: $.auth.data.clientSecret as string,
    code: $.auth.data.code as string,
    grant_type: 'authorization_code',
  }
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
    uid
  });

  const account = await getCurrentAccount($) as TAccount;

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
      ".tag": account.account_type['.tag'],
    },
    rootInfo: {
      ".tag": account.root_info['.tag'],
      rootNamespaceId: account.root_info.root_namespace_id,
      homeNamespaceId: account.root_info.home_namespace_id,
    },
    screenName: `${account.name.display_name} - ${account.email}`,
  });
};

export default verifyCredentials;
