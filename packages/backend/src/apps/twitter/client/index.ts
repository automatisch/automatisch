import { IJSONObject, IApp } from '@automatisch/types';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import HttpClient from '../../../helpers/http-client';
import OAuthRequestToken from './endpoints/oauth-request-token';
import VerifyAccessToken from './endpoints/verify-access-token';
import GetCurrentUser from './endpoints/get-current-user';
import GetUserByUsername from './endpoints/get-user-by-username';
import GetUserTweets from './endpoints/get-user-tweets';

export default class TwitterClient {
  appData: IApp;
  connectionData: IJSONObject;
  parameters: IJSONObject;
  oauthClient: OAuth;
  httpClient: HttpClient;

  oauthRequestToken: OAuthRequestToken;
  verifyAccessToken: VerifyAccessToken;
  getCurrentUser: GetCurrentUser;
  getUserByUsername: GetUserByUsername;
  getUserTweets: GetUserTweets;

  static baseUrl = 'https://api.twitter.com';

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.connectionData = connectionData;
    this.appData = appData;
    this.parameters = parameters;

    this.httpClient = new HttpClient({ baseURL: TwitterClient.baseUrl });

    const consumerData = {
      key: this.connectionData.consumerKey as string,
      secret: this.connectionData.consumerSecret as string,
    };

    this.oauthClient = new OAuth({
      consumer: consumerData,
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });

    this.oauthRequestToken = new OAuthRequestToken(this);
    this.verifyAccessToken = new VerifyAccessToken(this);
    this.getCurrentUser = new GetCurrentUser(this);
    this.getUserByUsername = new GetUserByUsername(this);
    this.getUserTweets = new GetUserTweets(this);
  }
}
