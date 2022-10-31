import { DateTime } from 'luxon';
import { IGlobalVariable } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import cronTimes from '../../common/cron-times';
import getNextCronDateTime from '../../common/get-next-cron-date-time';
import getDateTimeObjectRepresentation from '../../common/get-date-time-object';

export default defineTrigger({
  name: 'Every week',
  key: 'everyWeek',
  description: 'Triggers every week.',
  arguments: [
    {
      label: 'Day of the week',
      key: 'weekday',
      type: 'dropdown' as const,
      required: true,
      value: null,
      variables: false,
      options: [
        {
          label: 'Monday',
          value: 1,
        },
        {
          label: 'Tuesday',
          value: 2,
        },
        {
          label: 'Wednesday',
          value: 3,
        },
        {
          label: 'Thursday',
          value: 4,
        },
        {
          label: 'Friday',
          value: 5,
        },
        {
          label: 'Saturday',
          value: 6,
        },
        {
          label: 'Sunday',
          value: 0,
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
    const interval = cronTimes.everyWeekOnAndAt(
      parameters.weekday as number,
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
