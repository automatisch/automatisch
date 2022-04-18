import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';
import Authentication from './authentication';
import Triggers from './triggers';

export default class Github implements IService {
  authenticationClient: IAuthentication;
  triggers: Triggers;

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.authenticationClient = new Authentication(appData, connectionData);
    this.triggers = new Triggers(connectionData, parameters);
  }
}
