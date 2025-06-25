import { DOCUMENT_API_BASE_PATH } from "./constants.js";

export function getFrappeSiteURL($) {
  const siteUrl = $.auth.data?.site_url;
  if (!siteUrl) {
    throw new Error('Frappe site URL is not set in the authentication data.');
  }
  return siteUrl;
}

export function getOAuthRedirectUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key === 'oAuthRedirectUrl'
  );
  if (!oauthRedirectUrlField || !oauthRedirectUrlField.value) {
    throw new Error('OAuth redirect URL is not set in the authentication data.');
  }
  return oauthRedirectUrlField.value;
}

export function getFrappeDocumentAPIUrl($, doctype) {
  return `${getFrappeSiteURL($)}${DOCUMENT_API_BASE_PATH}/${doctype}`;
}