import { URL, URLSearchParams } from 'url';
import getBaseUrl from '../common/get-base-url.js';

export default async function generateAuthUrl($) {
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: $.auth.data.oAuthRedirectUrl,
    response_type: 'code',
  });

  const baseUrl = getBaseUrl($);
  const path = `/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url: new URL(path, baseUrl).toString(),
  });
}
