import Triggers from './triggers';
import {
  IService,
  IApp,
  IJSONObject,
} from '@automatisch/types';

export default class Schedule implements IService {
  triggers: Triggers;

  constructor(
    appData: IApp,
    connectionData: IJSONObject,
    parameters: IJSONObject
  ) {
    this.triggers = new Triggers(connectionData, parameters);
  }
}
