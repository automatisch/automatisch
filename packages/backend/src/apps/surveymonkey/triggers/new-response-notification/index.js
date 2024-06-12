import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New response notification',
  key: 'newResponseNotification',
  type: 'webhook',
  description: 'Triggers a notification upon the completion of your survey.',
  arguments: [
    {
      label: 'Survey',
      key: 'surveyId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSurveys',
          },
        ],
      },
    },
  ],

  async run($) {
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (!isEmpty(lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        },
      });
    }
  },

  async registerHook($) {
    const surveyId = $.step.parameters.surveyId;

    const body = JSON.stringify({
      name: $.flow.id,
      subscription_url: $.webhookUrl,
      event_type: 'response_completed',
      object_type: 'survey',
      object_ids: [surveyId],
    });

    const { data } = await $.http.post('/v3/webhooks?bypass_ping=true', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await $.flow.setRemoteWebhookId(data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/v3/webhooks/${$.flow.remoteWebhookId}`);
  },
});
