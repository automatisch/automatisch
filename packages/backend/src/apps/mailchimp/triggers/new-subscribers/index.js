import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New subscribers',
  key: 'newSubscribers',
  type: 'webhook',
  description: 'Triggers when a new subscriber is appended to an audience.',
  arguments: [
    {
      label: 'Audience',
      key: 'audienceId',
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
            value: 'listAudiences',
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
    const audienceId = $.step.parameters.audienceId;

    const computedWebhookEvent = {
      data: {
        id: Crypto.randomUUID(),
        email: 'user@automatisch.io',
        ip_opt: '127.0.0.1',
        merges: {
          EMAIL: 'user@automatisch.io',
          FNAME: 'FNAME',
          LNAME: 'LNAME',
          PHONE: '',
          ADDRESS: '',
          BIRTHDAY: '',
        },
        web_id: Crypto.randomUUID(),
        list_id: audienceId,
        email_type: 'html',
      },
      type: 'subscribe',
      fired_at: new Date().toLocaleString(),
    };

    const dataItem = {
      raw: computedWebhookEvent,
      meta: {
        internalId: '',
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const audienceId = $.step.parameters.audienceId;

    const payload = {
      url: $.webhookUrl,
      events: {
        subscribe: true,
      },
      sources: {
        user: true,
        admin: true,
        api: true,
      },
    };

    const response = await $.http.post(
      `/3.0/lists/${audienceId}/webhooks`,
      payload
    );

    await $.flow.setRemoteWebhookId(response.data.id);
  },

  async unregisterHook($) {
    const audienceId = $.step.parameters.audienceId;

    await $.http.delete(
      `/3.0/lists/${audienceId}/webhooks/${$.flow.remoteWebhookId}`
    );
  },
});
