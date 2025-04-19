import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const clientId = $.auth.data?.clientId;
  const oAuthRedirectUrl = $.auth.data?.oAuthRedirectUrl;

  if (!clientId) {
    throw new Error('Client ID is required!');
  }

  if (!oAuthRedirectUrl) {
    throw new Error('OAuth Redirect URL is required!');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: oAuthRedirectUrl,
    response_type: 'code',
    scope: 'email,public_profile,pages_show_list,pages_read_engagement,pages_manage_posts,pages_read_user_content',
    state: Date.now().toString(),
  });

  const url = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
  
  await $.auth.set({ url });
  
  return url;
} 