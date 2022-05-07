import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';
import Authentication from './authentication';
import Actions from './actions';
import Data from './data';

export default class Gitlab implements IService {
  authenticationClient: IAuthentication;
  actions: Actions;
  data: Data;

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.authenticationClient = new Authentication(appData, connectionData);
    this.actions = new Actions(connectionData, parameters);
    this.data = new Data(connectionData, parameters);
  }
}
