import { IJSONObject } from '@automatisch/types';
import EveryHour from './triggers/every-hour';
import EveryDay from './triggers/every-day';

export default class Triggers {
  everyHour: EveryHour;
  everyDay: EveryDay;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.everyHour = new EveryHour(parameters);
    this.everyDay = new EveryDay(parameters);
  }
}
