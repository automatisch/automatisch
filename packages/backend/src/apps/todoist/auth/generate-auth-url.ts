import { IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

export default async function generateAuthUrl($: IGlobalVariable) {
  const scopes = ['data:read_write'];
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    scope: scopes.join(','),
  });

  const url = `${$.app.baseUrl
    }/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
