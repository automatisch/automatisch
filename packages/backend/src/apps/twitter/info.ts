import appInfoType from '../../types/app-info';
import appConfig from '../../config/app';

const appInfo: appInfoType = {
  "name": "Twitter",
  "key": "twitter",
  "iconUrl": `${appConfig.baseUrl}/apps/twitter/assets/favicon.svg`,
  "docUrl": "https://automatisch.io/docs/twitter",
  "primaryColor": "2DAAE1",
  "fields": [
    {
      "key": "oAuthRedirectUrl",
      "label": "OAuth Redirect URL",
      "type": "string",
      "required": true,
      "readOnly": true,
      "value": "http://localhost:3001/app/twitter/connections/add",
      "placeholder": null,
      "description": "When asked to input an OAuth callback or redirect URL in Twitter OAuth, enter the URL above.",
      "docUrl": "https://automatisch.io/docs/twitter#oauth-redirect-url",
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
      "docUrl": "https://automatisch.io/docs/twitter#consumer-key",
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
      "docUrl": "https://automatisch.io/docs/twitter#consumer-secret",
      "clickToCopy": false
    }
  ],
  "authenticationSteps": [
    {
      "step": 1,
      "type": "mutation",
      "name": "createConnection",
      "fields": [
        {
          "name": "key",
          "value": "{key}"
        },
        {
          "name": "data",
          "value": null,
          "fields": [
            {
              "name": "consumerKey",
              "value": "{fields.consumerKey}"
            },
            {
              "name": "consumerSecret",
              "value": "{fields.consumerSecret}"
            }
          ]
        }
      ]
    },
    {
      "step": 2,
      "type": "mutation",
      "name": "createAuthLink",
      "fields": [
        {
          "name": "id",
          "value": "{createConnection.id}"
        }
      ]
    },
    {
      "step": 3,
      "type": "openWithPopup",
      "name": "openTwitterAuthPopup",
      "fields": [
        {
          "name": "url",
          "value": "{createAuthLink.url}"
        }
      ]
    },
    {
      "step": 4,
      "type": "mutation",
      "name": "updateConnection",
      "fields": [
        {
          "name": "id",
          "value": "{createConnection.id}"
        },
        {
          "name": "data",
          "value": null,
          "fields": [
            {
              "name": "oauthVerifier",
              "value": "{openTwitterAuthPopup.oauth_verifier}"
            }
          ]
        }
      ]
    }
  ]
}

export default appInfo;
