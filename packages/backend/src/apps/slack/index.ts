import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';
import Authentication from './authentication';
import Triggers from './triggers';
import Actions from './actions';
import Data from './data';

export default class Slack implements IService {
  authenticationClient: IAuthentication;
  triggers: Triggers;
  actions: Actions;
  data: Data;

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.authenticationClient = new Authentication(appData, connectionData);
    this.data = new Data(connectionData);
    this.triggers = new Triggers(connectionData, parameters);
    this.actions = new Actions(connectionData, parameters);
  }
}
