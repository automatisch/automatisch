import { IGlobalVariable } from '@automatisch/types';
import { URL, URLSearchParams } from 'url';
import getBaseUrl from '../common/get-base-url';

export default async function generateAuthUrl($: IGlobalVariable) {
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: $.auth.data.oAuthRedirectUrl as string,
    response_type: 'code',
  });

  const baseUrl = getBaseUrl($);
  const path = `/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url: new URL(path, baseUrl).toString(),
  });
}
