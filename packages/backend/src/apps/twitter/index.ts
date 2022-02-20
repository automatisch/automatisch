import Authentication from './authentication';
import Triggers from './triggers';
import Actions from './actions';

export default class Twitter {
  authenticationClient: any;
  triggers: any;
  actions: any;

  constructor(connectionData: any, parameters: any) {
    this.authenticationClient = new Authentication(connectionData);
    this.triggers = new Triggers(connectionData);
    this.actions = new Actions(connectionData, parameters);
  }
}
