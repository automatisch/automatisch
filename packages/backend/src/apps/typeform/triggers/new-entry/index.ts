import Crypto from 'crypto';
import appConfig from '../../../../config/app';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New entry',
  key: 'newEntry',
  type: 'webhook',
  description: 'Triggers when a new form is submitted.',
  arguments: [
    {
      label: 'Form',
      key: 'formId',
      type: 'dropdown' as const,
      required: true,
      description: 'Pick a form to receive submissions.',
      variables: false,
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
    const { data: form } = await $.http.get(
      `/forms/${$.step.parameters.formId}`
    );

    const { data: responses } = await $.http.get(
      `/forms/${$.step.parameters.formId}/responses`
    );

    const lastResponse = responses.items[0];

    if (!lastResponse) {
      return;
    }

    const computedWebhookEvent = {
      event_type: 'form_response',
      form_response: {
        form_id: form.id,
        token: lastResponse.token,
        landed_at: lastResponse.landed_at,
        submitted_at: lastResponse.submitted_at,
        definition: {
          id: $.step.parameters.formId,
          title: form.title,
          fields: form?.fields,
        },
        answers: lastResponse.answers,
      },
    };

    const dataItem = {
      raw: computedWebhookEvent,
      meta: {
        internalId: computedWebhookEvent.form_response.token,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const subscriptionPayload = {
      enabled: true,
      url: $.webhookUrl,
      secret: appConfig.webhookSecretKey,
    };

    await $.http.put(
      `/forms/${$.step.parameters.formId}/webhooks/${$.flow.id}`,
      subscriptionPayload
    );
  },

  async unregisterHook($) {
    await $.http.delete(
      `/forms/${$.step.parameters.formId}/webhooks/${$.flow.id}`
    );
  },
});
