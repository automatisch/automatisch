import axios from 'axios';
import { URLSearchParams } from 'url';

export default async function verifyCredentials($) {
  const { clientId, clientSecret, oAuthRedirectUrl, url, code: storedCode } = $.auth.data;
  
  // Check if code is directly available in the request
  let code = $.request?.query?.code || $.request?.body?.code;
  
  // Check if code is stored in auth.data
  if (!code && storedCode) {
    code = storedCode;
  }
  
  // If not found in request or auth.data, try to extract code from URL if available
  if (!code && url) {
    try {
      const currentUrl = new URL(url);
      const urlParams = new URLSearchParams(currentUrl.search);
      code = urlParams.get('code');
    } catch (error) {
      console.error('Error parsing auth URL:', error);
    }
  }
  
  if (!code) {
    throw new Error('Authorization code is missing. Please complete the OAuth flow first.');
  }

  const tokenUrlParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: oAuthRedirectUrl,
  });

  const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?${tokenUrlParams.toString()}`;

  // Get user access token
  const { data } = await axios.get(tokenUrl);
  const { access_token: accessToken } = data;

  // Get user information
  const userResponse = await axios.get(
    `https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${accessToken}`
  );

  const { id, name, email } = userResponse.data;

  // Get list of pages the user can access
  const pagesResponse = await axios.get(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
  );

  // Store the available pages data to be used later
  const pages = pagesResponse.data.data || [];

  // Store the credentials in the connection
  await $.auth.set({
    accountId: id,
    email,
    name,
    accessToken,
    pages,
  });
  
  return true;
} 