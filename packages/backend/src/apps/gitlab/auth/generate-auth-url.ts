import { IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

export default async function generateAuthUrl($: IGlobalVariable) {
  // ref: https://docs.gitlab.com/ee/api/oauth2.html#authorization-code-flow

  const scopes = ['api', 'read_user'];

  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    redirect_uri: $.auth.data.oAuthRedirectUrl as string,
    scope: scopes.join(' '),
    response_type: 'code',
    state: `${Date.now()}`,
  });

  const url = `${
    $.auth.data.oInstanceUrl
  }/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
