import {
  IService,
  IAuthentication,
  IFlow,
  IStep,
  IConnection,
} from '@automatisch/types';
import Authentication from './authentication';
import Triggers from './triggers';
import Actions from './actions';
import TwitterClient from './client';

export default class Twitter implements IService {
  client: TwitterClient;

  authenticationClient: IAuthentication;
  triggers: Triggers;
  actions: Actions;

  constructor(connection: IConnection, flow?: IFlow, step?: IStep) {
    this.client = new TwitterClient(connection, flow, step);

    this.authenticationClient = new Authentication(this.client);
    this.triggers = new Triggers(this.client);
    this.actions = new Actions(this.client);
  }
}
