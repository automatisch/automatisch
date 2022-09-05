import {
  IService,
  IAuthentication,
  IConnection,
  IFlow,
  IStep,
} from '@automatisch/types';
import Authentication from './authentication';
import Triggers from './triggers';
import Actions from './actions';
import Data from './data';
import SlackClient from './client';

export default class Slack implements IService {
  client: SlackClient;

  authenticationClient: IAuthentication;
  triggers: Triggers;
  actions: Actions;
  data: Data;

  constructor(connection: IConnection, flow?: IFlow, step?: IStep) {
    this.client = new SlackClient(connection, flow, step);

    this.authenticationClient = new Authentication(this.client);
    // this.triggers = new Triggers(this.client);
    this.actions = new Actions(this.client);
    this.data = new Data(this.client);
  }
}
