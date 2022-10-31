import { DateTime } from 'luxon';
import { IGlobalVariable } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import cronTimes from '../../common/cron-times';
import getNextCronDateTime from '../../common/get-next-cron-date-time';
import getDateTimeObjectRepresentation from '../../common/get-date-time-object';

export default defineTrigger({
  name: 'Every month',
  key: 'everyMonth',
  description: 'Triggers every month.',
  arguments: [
    {
      label: 'Day of the month',
      key: 'day',
      type: 'dropdown' as const,
      required: true,
      value: null,
      variables: false,
      options: [
        {
          label: '1',
          value: 1,
        },
        {
          label: '2',
          value: 2,
        },
        {
          label: '3',
          value: 3,
        },
        {
          label: '4',
          value: 4,
        },
        {
          label: '5',
          value: 5,
        },
        {
          label: '6',
          value: 6,
        },
        {
          label: '7',
          value: 7,
        },
        {
          label: '8',
          value: 8,
        },
        {
          label: '9',
          value: 9,
        },
        {
          label: '10',
          value: 10,
        },
        {
          label: '11',
          value: 11,
        },
        {
          label: '12',
          value: 12,
        },
        {
          label: '13',
          value: 13,
        },
        {
          label: '14',
          value: 14,
        },
        {
          label: '15',
          value: 15,
        },
        {
          label: '16',
          value: 16,
        },
        {
          label: '17',
          value: 17,
        },
        {
          label: '18',
          value: 18,
        },
        {
          label: '19',
          value: 19,
        },
        {
          label: '20',
          value: 20,
        },
        {
          label: '21',
          value: 21,
        },
        {
          label: '22',
          value: 22,
        },
        {
          label: '23',
          value: 23,
        },
        {
          label: '24',
          value: 24,
        },
        {
          label: '25',
          value: 25,
        },
        {
          label: '26',
          value: 26,
        },
        {
          label: '27',
          value: 27,
        },
        {
          label: '28',
          value: 28,
        },
        {
          label: '29',
          value: 29,
        },
        {
          label: '30',
          value: 30,
        },
        {
          label: '31',
          value: 31,
        },
      ],
    },
    {
      label: 'Time of day',
      key: 'hour',
      type: 'dropdown' as const,
      required: true,
      value: null,
      variables: false,
      options: [
        {
          label: '00:00',
          value: 0,
        },
        {
          label: '01:00',
          value: 1,
        },
        {
          label: '02:00',
          value: 2,
        },
        {
          label: '03:00',
          value: 3,
        },
        {
          label: '04:00',
          value: 4,
        },
        {
          label: '05:00',
          value: 5,
        },
        {
          label: '06:00',
          value: 6,
        },
        {
          label: '07:00',
          value: 7,
        },
        {
          label: '08:00',
          value: 8,
        },
        {
          label: '09:00',
          value: 9,
        },
        {
          label: '10:00',
          value: 10,
        },
        {
          label: '11:00',
          value: 11,
        },
        {
          label: '12:00',
          value: 12,
        },
        {
          label: '13:00',
          value: 13,
        },
        {
          label: '14:00',
          value: 14,
        },
        {
          label: '15:00',
          value: 15,
        },
        {
          label: '16:00',
          value: 16,
        },
        {
          label: '17:00',
          value: 17,
        },
        {
          label: '18:00',
          value: 18,
        },
        {
          label: '19:00',
          value: 19,
        },
        {
          label: '20:00',
          value: 20,
        },
        {
          label: '21:00',
          value: 21,
        },
        {
          label: '22:00',
          value: 22,
        },
        {
          label: '23:00',
          value: 23,
        },
      ],
    },
  ],

  getInterval(parameters: IGlobalVariable['step']['parameters']) {
    const interval = cronTimes.everyMonthOnAndAt(
      parameters.day as number,
      parameters.hour as number
    );

    return interval;
  },

  async run($) {
    const nextCronDateTime = getNextCronDateTime(
      this.getInterval($.step.parameters)
    );
    const dateTime = DateTime.now();
    const dateTimeObjectRepresentation = getDateTimeObjectRepresentation(
      $.execution.testRun ? nextCronDateTime : dateTime
    );

    const dataItem = {
      raw: dateTimeObjectRepresentation,
      meta: {
        internalId: dateTime.toMillis().toString(),
      },
    };

    $.pushTriggerItem(dataItem);
  },
});
