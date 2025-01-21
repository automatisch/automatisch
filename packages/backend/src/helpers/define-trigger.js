import logger from './logger.js';

export default function defineTrigger(triggerDefinition) {
  const isWebhookOrPoll =
    triggerDefinition.pollInterval || triggerDefinition.type === 'webhook';

  const schedulerTriggers = [
    'everyNMinutes',
    'everyHour',
    'everyDay',
    'everyWeek',
    'everyMonth',
  ];

  const isSchedulerTrigger = schedulerTriggers.includes(triggerDefinition.key);

  const haveValidTriggerType = isWebhookOrPoll || isSchedulerTrigger;

  if (!haveValidTriggerType) {
    logger.info(triggerDefinition);

    throw new Error(
      `Trigger must have a poll interval or be a webhook for ${triggerDefinition.key}`
    );
  }

  return triggerDefinition;
}
