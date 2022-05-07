import { DateTime } from 'luxon';
import type { IJSONObject, IJSONValue, ITrigger } from '@automatisch/types';
import { cronTimes, getNextCronDateTime, getDateTimeObjectRepresentation } from '../utils';

export default class EveryHour implements ITrigger {
  triggersOnWeekend?: boolean | string;

  constructor(parameters: IJSONObject) {
    if (parameters.triggersOnWeekend) {
      this.triggersOnWeekend = parameters.triggersOnWeekend as string;
    }
  }

  get interval() {
    if (this.triggersOnWeekend) {
      return cronTimes.everyHour;
    }

    return cronTimes.everyHourExcludingWeekends;
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
