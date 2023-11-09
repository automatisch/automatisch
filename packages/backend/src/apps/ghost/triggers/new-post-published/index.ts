import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New post published',
  key: 'newPostPublished',
  type: 'webhook',
  description: 'Triggers when a new post is published.',

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
      webhooks: [
        {
          event: 'post.published',
          target_url: $.webhookUrl,
          name: `Flow ID: ${$.flow.id}`,
        },
      ],
    };

    const response = await $.http.post('/admin/webhooks/', payload);
    const id = response.data.webhooks[0].id;

    await $.flow.setRemoteWebhookId(id);
  },

  async unregisterHook($) {
    await $.http.delete(`/admin/webhooks/${$.flow.remoteWebhookId}/`);
  },
});
