import { DateTime } from 'luxon';
import type { IJSONObject, IJSONValue, ITrigger } from '@automatisch/types';
import { cronTimes, getNextCronDateTime, getDateTimeObjectRepresentation } from '../utils';

export default class EveryWeek implements ITrigger {
  weekday?: number;
  hour?: number;

  constructor(parameters: IJSONObject) {
    if (parameters.weekday) {
      this.weekday = parameters.weekday as number;
    }

    if (parameters.hour) {
      this.hour = parameters.hour as number;
    }
  }

  get interval() {
    return cronTimes.everyWeekOnAndAt(this.weekday, this.hour);
  }

  async run(startDateTime: Date) {
    const dateTime = DateTime.fromJSDate(startDateTime);
    const dateTimeObjectRepresentation = getDateTimeObjectRepresentation(dateTime) as IJSONValue;

    return [dateTimeObjectRepresentation] as IJSONValue;
  }

  async testRun() {
    const nextCronDateTime = getNextCronDateTime(this.interval);
    const dateTimeObjectRepresentation = getDateTimeObjectRepresentation(nextCronDateTime) as IJSONValue;

    return [dateTimeObjectRepresentation] as IJSONValue;
  }
}
