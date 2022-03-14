import Authentication from './authentication';
import Data from './data';
import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';

export default class Slack implements IService {
  authenticationClient: IAuthentication;
  data: Data;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.authenticationClient = new Authentication(appData, connectionData);
    this.data = new Data(connectionData);
  }
}
