import Triggers from './triggers';
import {
  IService,
  IConnection,
  IFlow,
  IStep,
} from '@automatisch/types';

export default class Scheduler implements IService {
  triggers: Triggers;

  constructor(connection: IConnection, flow: IFlow, step: IStep) {
    this.triggers = new Triggers(step.parameters);
  }
}
