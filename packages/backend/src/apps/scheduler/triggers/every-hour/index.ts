import { DateTime } from 'luxon';
import { IGlobalVariable, IJSONValue } from '@automatisch/types';
import cronTimes from '../../common/cron-times';
import getNextCronDateTime from '../../common/get-next-cron-date-time';
import getDateTimeObjectRepresentation from '../../common/get-date-time-object';

export default {
  name: 'Every hour',
  key: 'everyHour',
  description: 'Triggers every hour.',
  substeps: [
    {
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: [
        {
          label: 'Trigger on weekends?',
          key: 'triggersOnWeekend',
          type: 'dropdown',
          description: 'Should this flow trigger on Saturday and Sunday?',
          required: true,
          value: true,
          variables: false,
          options: [
            {
              label: 'Yes',
              value: true
            },
            {
              label: 'No',
              value: false
            }
          ]
        }
      ]
    },
    {
      key: 'testStep',
      name: 'Test trigger'
    }
  ],

  getInterval(parameters: IGlobalVariable["db"]["step"]["parameters"]) {
    if (parameters.triggersOnWeekend) {
      return cronTimes.everyHour
    }

    return cronTimes.everyHourExcludingWeekends;
  },

  async run($: IGlobalVariable, startDateTime: Date) {
    const dateTime = DateTime.fromJSDate(startDateTime);
    const dateTimeObjectRepresentation = getDateTimeObjectRepresentation(dateTime) as IJSONValue;

    return { data: [dateTimeObjectRepresentation] };
  },

  async testRun($: IGlobalVariable) {
    const nextCronDateTime = getNextCronDateTime(this.getInterval($.db.step.parameters));
    const dateTimeObjectRepresentation = getDateTimeObjectRepresentation(nextCronDateTime) as IJSONValue;

    return { data: [dateTimeObjectRepresentation] };
  },
};
