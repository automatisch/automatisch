import { IFlow, IStep, IConnection } from '@automatisch/types';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import HttpClient from '../../../helpers/http-client';
import OAuthRequestToken from './endpoints/oauth-request-token';
import VerifyAccessToken from './endpoints/verify-access-token';
import GetCurrentUser from './endpoints/get-current-user';
import GetUserByUsername from './endpoints/get-user-by-username';
import GetUserTweets from './endpoints/get-user-tweets';
import CreateTweet from './endpoints/create-tweet';
import SearchTweets from './endpoints/search-tweets';

export default class TwitterClient {
  flow: IFlow;
  step: IStep;
  connection: IConnection;
  oauthClient: OAuth;
  httpClient: HttpClient;

  oauthRequestToken: OAuthRequestToken;
  verifyAccessToken: VerifyAccessToken;
  getCurrentUser: GetCurrentUser;
  getUserByUsername: GetUserByUsername;
  getUserTweets: GetUserTweets;
  createTweet: CreateTweet;
  searchTweets: SearchTweets;

  static baseUrl = 'https://api.twitter.com';

  constructor(connection: IConnection, flow?: IFlow, step?: IStep) {
    this.connection = connection;
    this.flow = flow;
    this.step = step;

    this.httpClient = new HttpClient({ baseURL: TwitterClient.baseUrl });

    const consumerData = {
      key: this.connection.formattedData.consumerKey as string,
      secret: this.connection.formattedData.consumerSecret as string,
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
    this.createTweet = new CreateTweet(this);
    this.searchTweets = new SearchTweets(this);
  }
}
