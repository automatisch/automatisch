import crypto from 'crypto';
import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope.js';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const state = crypto.randomBytes(100).toString('base64url');
  const codeVerifier = crypto.randomBytes(96).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: authScope.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const url = `https://airtable.com/oauth2/v1/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
    originalCodeChallenge: codeChallenge,
    originalState: state,
    codeVerifier,
  });
}
