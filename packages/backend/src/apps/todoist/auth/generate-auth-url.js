import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const scopes = ['data:read_write'];
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    scope: scopes.join(','),
  });

  const url = `${$.app.baseUrl}/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
