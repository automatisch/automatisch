import { IField, IGlobalVariable } from '@automatisch/types';
import qs from 'qs';

const scopes = [
  'channels:manage',
  'channels:read',
  'channels:join',
  'chat:write',
  'chat:write.customize',
  'chat:write.public',
  'files:write',
  'im:write',
  'mpim:write',
  'team:read',
  'users.profile:read',
  'users:read',
  'workflow.steps:execute',
  'users:read.email',
  'commands',
];
const userScopes = [
  'channels:history',
  'channels:read',
  'channels:write',
  'chat:write',
  'emoji:read',
  'files:read',
  'files:write',
  'groups:history',
  'groups:read',
  'groups:write',
  'im:read',
  'im:write',
  'mpim:write',
  'reactions:read',
  'reminders:write',
  'search:read',
  'stars:read',
  'team:read',
  'users.profile:read',
  'users.profile:write',
  'users:read',
  'users:read.email',
];

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = qs.stringify({
    client_id: $.auth.data.consumerKey as string,
    redirect_uri: redirectUri,
    scope: scopes.join(','),
    user_scope: userScopes.join(','),
  });

  const url = `${$.app.baseUrl}/oauth/v2/authorize?${searchParams}`;

  await $.auth.set({
    url,
  });
}
