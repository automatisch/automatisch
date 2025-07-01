export function getOAuthRedirectUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key === 'oAuthRedirectUrl'
  );

  return oauthRedirectUrlField.value;
}
