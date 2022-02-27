import Authentication from './authentication';

export default class Typeform {
  authenticationClient: any;

  constructor(appData: any, connectionData: any) {
    this.authenticationClient = new Authentication(appData, connectionData);
  }
}
