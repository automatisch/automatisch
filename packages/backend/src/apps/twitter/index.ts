import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';
import Authentication from './authentication';
import Triggers from './triggers';
import Actions from './actions';

export default class Twitter implements IService {
  authenticationClient: IAuthentication;
  triggers: Triggers;
  actions: Actions;

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.authenticationClient = new Authentication(appData, connectionData);
    this.triggers = new Triggers(connectionData);
    this.actions = new Actions(connectionData, parameters);
  }
}
