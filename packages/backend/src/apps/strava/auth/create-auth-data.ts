import { IField, IGlobalVariable } from '@automatisch/types';
import qs from 'qs';

export default async function createAuthData($: IGlobalVariable) {
  try {
    const oauthRedirectUrlField = $.app.auth.fields.find(
      (field: IField) => field.key == 'oAuthRedirectUrl'
    );
    const redirectUri = oauthRedirectUrlField.value;
    const searchParams = qs.stringify({
      client_id: $.auth.data.consumerKey as string,
      redirect_uri: redirectUri,
      approval_prompt: 'force',
      response_type: 'code',
      scope: 'read_all,profile:read_all,activity:read_all,activity:write',
    });

    await $.auth.set({
      url: `${$.app.baseUrl}/oauth/authorize?${searchParams}`,
    });
  } catch (error) {
    throw new Error(
      `Error occured while verifying credentials: ${error}`
    );
  }
}
