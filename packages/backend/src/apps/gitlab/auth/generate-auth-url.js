import { URL, URLSearchParams } from 'url';
import getBaseUrl from '../common/get-base-url.js';

export default async function generateAuthUrl($) {
  // ref: https://docs.gitlab.com/ee/api/oauth2.html#authorization-code-flow

  const scopes = ['api', 'read_user'];

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: $.auth.data.oAuthRedirectUrl,
    scope: scopes.join(' '),
    response_type: 'code',
    state: Date.now().toString(),
  });

  const baseUrl = getBaseUrl($);
  const path = `/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url: new URL(path, baseUrl).toString(),
  });
}
