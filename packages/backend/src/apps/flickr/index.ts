import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';
import Authentication from './authentication';
import Triggers from './triggers';
import Data from './data';

export default class Flickr implements IService {
  authenticationClient: IAuthentication;
  triggers: Triggers;
  data: Data;

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.authenticationClient = new Authentication(appData, connectionData);
    this.data = new Data(connectionData);
    this.triggers = new Triggers(connectionData, parameters);
  }
}
