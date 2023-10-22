import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty';
import defineTrigger from '../../../../helpers/define-trigger';
import webhookFilters from '../../common/webhook-filters';

export default defineTrigger({
  name: 'New activity',
  key: 'newActivity',
  type: 'webhook',
  description: 'Triggers when a new activity occurs.',
  arguments: [
    {
      label: 'Activity type',
      key: 'filters',
      type: 'dropdown' as const,
      required: true,
      description: 'Pick an activity type to receive events for.',
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
      name: $.flow.id,
      type: 'POST',
      url: $.webhookUrl,
      filters: [$.step.parameters.filters],
    };

    const { data } = await $.http.post(`/v2/public/api/webhooks`, payload);

    await $.flow.setRemoteWebhookId(data.id);
  },

  async unregisterHook($) {
    await $.http.delete(`/v2/public/api/webhooks/${$.flow.remoteWebhookId}`);
  },
});
