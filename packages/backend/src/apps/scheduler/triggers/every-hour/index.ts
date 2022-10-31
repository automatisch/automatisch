import { DateTime } from 'luxon';
import { IGlobalVariable } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import cronTimes from '../../common/cron-times';
import getNextCronDateTime from '../../common/get-next-cron-date-time';
import getDateTimeObjectRepresentation from '../../common/get-date-time-object';

export default defineTrigger({
  name: 'Every hour',
  key: 'everyHour',
  description: 'Triggers every hour.',
  arguments: [
    {
      label: 'Trigger on weekends?',
      key: 'triggersOnWeekend',
      type: 'dropdown' as const,
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

  getInterval(parameters: IGlobalVariable['step']['parameters']) {
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
