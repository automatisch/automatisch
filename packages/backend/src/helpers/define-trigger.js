import logger from '@/helpers/logger.js';

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
  const isMcpTrigger = triggerDefinition.key === 'mcpTool';

  const haveValidTriggerType =
    isWebhookOrPoll || isSchedulerTrigger || isMcpTrigger;

  if (!haveValidTriggerType) {
    logger.info(triggerDefinition);

    throw new Error(
      `Trigger must have a poll interval or be a webhook for ${triggerDefinition.key}`
    );
  }

  return triggerDefinition;
}
