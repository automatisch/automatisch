import Authentication from './authentication';
import {
  IService,
  IAuthentication,
  IApp,
  IJSONObject,
} from '@automatisch/types';

export default class Firebase implements IService {
  authenticationClient: IAuthentication;

  constructor(appData: IApp, connectionData: IJSONObject) {
    this.authenticationClient = new Authentication(appData, connectionData);
  }
}
