import Authentication from './authentication';
import Triggers from './triggers';
import Actions from './actions';

export default class Twitter {
  authenticationClient: any;
  triggers: any;
  actions: any;

  constructor(appData: any, connectionData: any, parameters: any) {
    this.authenticationClient = new Authentication(appData, connectionData);
    this.triggers = new Triggers(connectionData);
    this.actions = new Actions(connectionData, parameters);
  }
}
