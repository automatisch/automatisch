import { DateTime } from 'luxon';

import defineTrigger from '../../../../helpers/define-trigger.js';
import cronTimes from '../../common/cron-times.js';
import getNextCronDateTime from '../../common/get-next-cron-date-time.js';
import getDateTimeObjectRepresentation from '../../common/get-date-time-object.js';

export default defineTrigger({
  name: 'Every hour',
  key: 'everyHour',
  description: 'Triggers every hour.',
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
  ],

  getInterval(parameters) {
    if (parameters.triggersOnWeekend) {
      return cronTimes.everyHour;
    }

    return cronTimes.everyHourExcludingWeekends;
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
