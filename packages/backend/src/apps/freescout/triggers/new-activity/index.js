import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';
import webhookFilters from '../../common/webhook-filters.js';

export default defineTrigger({
  name: 'New event',
  key: 'newActivity',
  type: 'webhook',
  description: 'Triggers when a new event occurs.',
  arguments: [
    {
      label: 'Event type',
      key: 'filter',
      type: 'dropdown',
      required: true,
      description: 'Pick an event type to receive events for.',
      variables: false,
      options: webhookFilters,
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
    const payload = {
      url: $.webhookUrl,
      events: [$.step.parameters.filters],
    };

    const { data } = await $.http.post(`/api/webhooks`, payload);

    await $.flow.setRemoteWebhookId(data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/api/webhooks/${$.flow.remoteWebhookId}`);
  },
});
