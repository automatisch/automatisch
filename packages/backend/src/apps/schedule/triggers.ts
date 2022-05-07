import { IJSONObject } from '@automatisch/types';
import EveryHour from './triggers/every-hour';

export default class Triggers {
  everyHour: EveryHour;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.everyHour = new EveryHour(parameters);
  }
}
