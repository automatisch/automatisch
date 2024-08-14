import Crypto from 'crypto';
import { URLSearchParams } from 'url';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New submissions',
  key: 'newSubmissions',
  type: 'webhook',
  description:
    'Triggers when a new submission has been added to a specific form.',
  arguments: [
    {
      label: 'Form',
      key: 'formId',
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
            value: 'listForms',
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
    const sampleEventData = {
      ip: '127.0.0.1',
      type: 'WEB',
      appID: '',
      event: '',
      action: '',
      formID: Crypto.randomUUID(),
      parent: '',
      pretty: 'Name:test, E-mail:user@automatisch.io',
      teamID: '',
      unread: '',
      product: '',
      subject: '',
      isSilent: '',
      username: 'username',
      deviceIDs: 'Array',
      formTitle: 'Opt-In Form-Get Free Email Updates!',
      fromTable: '',
      customBody: '',
      documentID: '',
      rawRequest: '',
      webhookURL: '',
      customTitle: '',
      trackAction: 'Array',
      customParams: '',
      submissionID: Crypto.randomUUID(),
      customBodyParams: 'Array',
      customTitleParams: 'Array',
    };

    const dataItem = {
      raw: sampleEventData,
      meta: {
        internalId: sampleEventData.submissionID,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const formId = $.step.parameters.formId;

    const params = new URLSearchParams({
      webhookURL: $.webhookUrl,
    });

    const { data } = await $.http.post(
      `/form/${formId}/webhooks`,
      params.toString()
    );

    await $.flow.setRemoteWebhookId(data.content[0]);
  },

  async unregisterHook($) {
    const formId = $.step.parameters.formId;

    const { data } = await $.http.get(`/form/${formId}/webhooks`);

    const webhookURLs = Object.values(data.content);
    const webhookId = webhookURLs.findIndex((url) => url === $.webhookUrl);

    await $.http.delete(`/form/${formId}/webhooks/${webhookId}`);
  },
});
