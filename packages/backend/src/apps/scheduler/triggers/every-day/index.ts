import { DateTime } from 'luxon';
import { IGlobalVariable, IJSONValue } from '@automatisch/types';
import cronTimes from '../../common/cron-times';
import getNextCronDateTime from '../../common/get-next-cron-date-time';
import getDateTimeObjectRepresentation from '../../common/get-date-time-object';

export default {
  name: 'Every day',
  key: 'everyDay',
  description: 'Triggers every day.',
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
        },
        {
          label: 'Time of day',
          key: 'hour',
          type: 'dropdown',
          required: true,
          value: null,
          variables: false,
          options: [
            {
              label: '00:00',
              value: 0
            },
            {
              label: '01:00',
              value: 1
            },
            {
              label: '02:00',
              value: 2
            },
            {
              label: '03:00',
              value: 3
            },
            {
              label: '04:00',
              value: 4
            },
            {
              label: '05:00',
              value: 5
            },
            {
              label: '06:00',
              value: 6
            },
            {
              label: '07:00',
              value: 7
            },
            {
              label: '08:00',
              value: 8
            },
            {
              label: '09:00',
              value: 9
            },
            {
              label: '10:00',
              value: 10
            },
            {
              label: '11:00',
              value: 11
            },
            {
              label: '12:00',
              value: 12
            },
            {
              label: '13:00',
              value: 13
            },
            {
              label: '14:00',
              value: 14
            },
            {
              label: '15:00',
              value: 15
            },
            {
              label: '16:00',
              value: 16
            },
            {
              label: '17:00',
              value: 17
            },
            {
              label: '18:00',
              value: 18
            },
            {
              label: '19:00',
              value: 19
            },
            {
              label: '20:00',
              value: 20
            },
            {
              label: '21:00',
              value: 21
            },
            {
              label: '22:00',
              value: 22
            },
            {
              label: '23:00',
              value: 23
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
    if (parameters.triggersOnWeekend as boolean) {
      return cronTimes.everyDayAt(parameters.hour as number);
    }

    return cronTimes.everyDayExcludingWeekendsAt(parameters.hour as number);
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
