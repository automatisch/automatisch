import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

export default async function generateAuthUrl($: IGlobalVariable) {
  const scopes = [
    'read_odometer',
    'read_vehicle_info',
    'required:read_location',
  ];

  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;

  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: $.auth.data.clientId as string,
    scope: scopes.join(' '),
    redirect_uri: redirectUri,
    mode: 'simulated',
  });

  const url = `https://connect.smartcar.com/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
