import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
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

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.client = new TwitterClient(appData, connectionData, parameters);

    this.authenticationClient = new Authentication(this.client);
    this.triggers = new Triggers(this.client);
    this.actions = new Actions(this.client);
  }
}
