import TwitchApi from 'twitch-js';
import fetchUtil from 'twitch-js/lib/utils/fetch';
import Field from '../../types/field';

type TwitchTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: string;
};

export default class Authentication {
  appData: any;
  connectionData: any;
  client: any;

  constructor(appData: any, connectionData: any) {
    this.connectionData = connectionData;
    this.appData = appData;

    if (this.clientOptions.token) {
      this.client = new TwitchApi(this.clientOptions);
    }
  }

  get clientOptions() {
    return {
      token: this.connectionData.accessToken,
      clientId: this.connectionData.consumerKey,
      log: { enabled: true },
    };
  }

  get oauthRedirectUrl() {
    return this.appData.fields.find(
      (field: Field) => field.key == 'oAuthRedirectUrl'
    ).value;
  }

  async createAuthData() {
    const { url } = await fetchUtil('https://id.twitch.tv/oauth2/authorize', {
      search: {
        client_id: this.connectionData.consumerKey,
        redirect_uri: this.oauthRedirectUrl,
        response_type: 'code',
        scope: 'user:read:email',
      },
    });

    return { url };
  }

  async verifyCredentials() {
    const verifiedCredentials = (await fetchUtil(
      'https://id.twitch.tv/oauth2/token',
      {
        method: 'post',
        search: {
          client_id: this.connectionData.consumerKey,
          client_secret: this.connectionData.consumerSecret,
          code: this.connectionData.oauthVerifier,
          grant_type: 'authorization_code',
          redirect_uri: this.oauthRedirectUrl,
        },
      }
    )) as TwitchTokenResponse;

    this.connectionData.accessToken = verifiedCredentials.accessToken;

    const { api } = new TwitchApi(this.clientOptions);

    const { data } = await api.get('users');
    const [user] = data;

    return {
      consumerKey: this.connectionData.consumerKey,
      consumerSecret: this.connectionData.consumerSecret,
      accessToken: verifiedCredentials.accessToken,
      refreshToken: verifiedCredentials.refreshToken,
      expiresIn: verifiedCredentials.expiresIn,
      tokenType: verifiedCredentials.tokenType,
      userId: user.id,
      screenName: user.displayName,
    };
  }

  async isStillVerified() {
    try {
      await fetchUtil('https://id.twitch.tv/oauth2/userinfo', {
        headers: {
          Authorization: `Bearer ${this.connectionData.accessToken}`,
        },
      });

      return true;
    } catch (err) {
      return false;
    }
  }
}
