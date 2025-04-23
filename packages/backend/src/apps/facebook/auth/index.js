import generateAuthUrl from './generate-auth-url.js';
import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';

export default {
  fields: [
    {
      key: 'oAuthRedirectUrl',
      label: 'OAuth Redirect URL',
      type: 'string',
      required: true,
      readOnly: true,
      value: '{WEB_APP_URL}/app/facebook/connections/add',
      placeholder: null,
      description:
        'When asked to input an OAuth callback or redirect URL in Facebook App Dashboard, enter the URL above.',
      clickToCopy: true,
    },
    {
      key: 'clientId',
      label: 'App ID',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your Facebook App ID from the Facebook Developers Dashboard. To create a Facebook App, go to developers.facebook.com > My Apps > Create App > Choose "Other" as the app type.',
      clickToCopy: false,
    },
    {
      key: 'clientSecret',
      label: 'App Secret',
      type: 'string',
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'Your Facebook App Secret from the Facebook Developers Dashboard. Find this under Settings > Basic in your Facebook App Dashboard.',
      clickToCopy: false,
    },
    {
      key: 'setupInstructions',
      label: 'Setup Instructions',
      type: 'string',
      required: false,
      readOnly: true,
      value: null,
      placeholder: null,
      description: `To set up Facebook integration:
1. Go to developers.facebook.com and create a new app with type "Other"
2. After creating the app, go to App Settings > Basic to get your App ID and App Secret
3. Add the "Facebook Login" product to your app from the App Dashboard
4. In Facebook Login settings, add the OAuth Redirect URL above to "Valid OAuth Redirect URIs"
5. Go to App Review and add these permissions: pages_show_list, pages_read_engagement, pages_manage_posts, pages_read_user_content
6. Submit your app for review (only required for production use)`,
      clickToCopy: false,
    },
  ],

  generateAuthUrl,
  verifyCredentials,
  isStillVerified,
}; 