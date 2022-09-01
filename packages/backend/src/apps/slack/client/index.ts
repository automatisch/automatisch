import { IFlow, IStep, IConnection } from '@automatisch/types';
import HttpClient from '../../../helpers/http-client';
import VerifyAccessToken from './endpoints/verify-access-token';

export default class SlackClient {
  flow: IFlow;
  step: IStep;
  connection: IConnection;
  httpClient: HttpClient;

  verifyAccessToken: VerifyAccessToken;

  static baseUrl = 'https://slack.com/api';

  constructor(connection: IConnection, flow?: IFlow, step?: IStep) {
    this.connection = connection;
    this.flow = flow;
    this.step = step;

    this.httpClient = new HttpClient({ baseURL: SlackClient.baseUrl });
    this.verifyAccessToken = new VerifyAccessToken(this);
  }
}
