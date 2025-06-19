import { DateTime } from 'luxon';

import defineTrigger from '../../../../helpers/define-trigger.js';
import cronTimes from '../../common/cron-times.js';
import getNextCronDateTime from '../../common/get-next-cron-date-time.js';
import getDateTimeObjectRepresentation from '../../common/get-date-time-object.js';

export default defineTrigger({
  name: 'Every N minutes',
  key: 'everyNMinutes',
  description: 'Triggers every N minutes.',
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
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
    {
      label: 'Interval',
      key: 'interval',
      type: 'dropdown',
      required: true,
      value: null,
      variables: false,
      options: [
        { label: 'Every 1 minute', value: 1 },
        { label: 'Every 2 minutes', value: 2 },
        { label: 'Every 3 minutes', value: 3 },
        { label: 'Every 4 minutes', value: 4 },
        { label: 'Every 5 minutes', value: 5 },
        { label: 'Every 6 minutes', value: 6 },
        { label: 'Every 7 minutes', value: 7 },
        { label: 'Every 8 minutes', value: 8 },
        { label: 'Every 9 minutes', value: 9 },
        { label: 'Every 10 minutes', value: 10 },
        { label: 'Every 11 minutes', value: 11 },
        { label: 'Every 12 minutes', value: 12 },
        { label: 'Every 13 minutes', value: 13 },
        { label: 'Every 14 minutes', value: 14 },
        { label: 'Every 15 minutes', value: 15 },
        { label: 'Every 16 minutes', value: 16 },
        { label: 'Every 17 minutes', value: 17 },
        { label: 'Every 18 minutes', value: 18 },
        { label: 'Every 19 minutes', value: 19 },
        { label: 'Every 20 minutes', value: 20 },
        { label: 'Every 21 minutes', value: 21 },
        { label: 'Every 22 minutes', value: 22 },
        { label: 'Every 23 minutes', value: 23 },
        { label: 'Every 24 minutes', value: 24 },
        { label: 'Every 25 minutes', value: 25 },
        { label: 'Every 26 minutes', value: 26 },
        { label: 'Every 27 minutes', value: 27 },
        { label: 'Every 28 minutes', value: 28 },
        { label: 'Every 29 minutes', value: 29 },
        { label: 'Every 30 minutes', value: 30 },
        { label: 'Every 31 minutes', value: 31 },
        { label: 'Every 32 minutes', value: 32 },
        { label: 'Every 33 minutes', value: 33 },
        { label: 'Every 34 minutes', value: 34 },
        { label: 'Every 35 minutes', value: 35 },
        { label: 'Every 36 minutes', value: 36 },
        { label: 'Every 37 minutes', value: 37 },
        { label: 'Every 38 minutes', value: 38 },
        { label: 'Every 39 minutes', value: 39 },
        { label: 'Every 40 minutes', value: 40 },
        { label: 'Every 41 minutes', value: 41 },
        { label: 'Every 42 minutes', value: 42 },
        { label: 'Every 43 minutes', value: 43 },
        { label: 'Every 44 minutes', value: 44 },
        { label: 'Every 45 minutes', value: 45 },
        { label: 'Every 46 minutes', value: 46 },
        { label: 'Every 47 minutes', value: 47 },
        { label: 'Every 48 minutes', value: 48 },
        { label: 'Every 49 minutes', value: 49 },
        { label: 'Every 50 minutes', value: 50 },
        { label: 'Every 51 minutes', value: 51 },
        { label: 'Every 52 minutes', value: 52 },
        { label: 'Every 53 minutes', value: 53 },
        { label: 'Every 54 minutes', value: 54 },
        { label: 'Every 55 minutes', value: 55 },
        { label: 'Every 56 minutes', value: 56 },
        { label: 'Every 57 minutes', value: 57 },
        { label: 'Every 58 minutes', value: 58 },
        { label: 'Every 59 minutes', value: 59 },
      ],
    },
  ],

  getInterval(parameters) {
    if (parameters.triggersOnWeekend) {
      return cronTimes.everyNMinutes(parameters.interval);
    }

    return cronTimes.everyNMinutesExcludingWeekends(parameters.interval);
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
