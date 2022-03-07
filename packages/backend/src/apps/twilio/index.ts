import Authentication from './authentication';
import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';

export default class Twilio implements IService {
  authenticationClient: IAuthentication;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.authenticationClient = new Authentication(appData, connectionData);
  }
}
