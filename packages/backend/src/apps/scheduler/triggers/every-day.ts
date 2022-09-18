import { DateTime } from 'luxon';
import type { IStep, IJSONValue, ITrigger } from '@automatisch/types';
import { cronTimes, getNextCronDateTime, getDateTimeObjectRepresentation } from '../utils';

export default class EveryDay implements ITrigger {
  triggersOnWeekend?: boolean;
  hour?: number;

  constructor(parameters: IStep["parameters"]) {
    if (parameters.triggersOnWeekend) {
      this.triggersOnWeekend = parameters.triggersOnWeekend as boolean;
    }

    if (parameters.hour) {
      this.hour = parameters.hour as number;
    }
  }

  get interval() {
    if (this.triggersOnWeekend) {
      return cronTimes.everyDayAt(this.hour);
    }

    return cronTimes.everyDayExcludingWeekendsAt(this.hour);
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
