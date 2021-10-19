import appInfoType from '../../types/app-info';
import appConfig from '../../config/app';

const appInfo: appInfoType = {
  "name": "Twitch",
  "key": "twitch",
  "iconUrl": `${appConfig.baseUrl}/apps/twitch/assets/favicon.svg`,
  "docUrl": "https://automatisch.io/docs/twitch",
  "primaryColor": "6441a5",
  "fields": [
    {
      "key": "oAuthRedirectUrl",
      "label": "OAuth Redirect URL",
      "type": "string",
      "required": true,
      "readOnly": true,
      "value": "http://localhost:3000/sample",
      "placeholder": null,
      "description": "When asked to input an OAuth callback or redirect URL in Twitch OAuth, enter the URL above.",
      "docUrl": "https://automatisch.io/docs/twitch#oauth-redirect-url",
      "clickToCopy": true
    },
    {
      "key": "consumerKey",
      "label": "Consumer Key",
      "type": "string",
      "required": true,
      "readOnly": false,
      "value": null,
      "placeholder": null,
      "description": null,
      "docUrl": "https://automatisch.io/docs/twitch#consumer-key",
      "clickToCopy": false
    },
    {
      "key": "consumerSecret",
      "label": "Consumer Secret",
      "type": "string",
      "required": true,
      "readOnly": false,
      "value": null,
      "placeholder": null,
      "description": null,
      "docUrl": "https://automatisch.io/docs/twitch#consumer-secret",
      "clickToCopy": false
    }
  ]
}

export default appInfo;
