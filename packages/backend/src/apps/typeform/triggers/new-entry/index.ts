import { IJSONObject } from '@automatisch/types';
import appConfig from '../../../../config/app';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New entry',
  key: 'newEntry',
  type: 'webhook',
  description: 'Triggers when a new form submitted.',
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

  async testRun($) {
    const createApiResponse = await $.http.get(
      `/forms/${$.step.parameters.formId}`
    );

    const responsesApiResponse = await $.http.get(
      `/forms/${$.step.parameters.formId}/responses`
    );

    const lastResponse = responsesApiResponse.data.items[0];

    const computedResponseItem = {
      event_type: 'form_response',
      form_response: {
        form_id: $.step.parameters.formId,
        token: lastResponse.token,
        landed_at: lastResponse.landed_at,
        submitted_at: lastResponse.submitted_at,
        definion: {
          id: $.step.parameters.formId,
          title: createApiResponse.data.title,
          fields: createApiResponse.data?.fields?.map((field: IJSONObject) => ({
            id: field.id,
            ref: field.ref,
            type: field.type,
            title: field.title,
            properties: {},
            choices: (
              (field?.properties as IJSONObject)?.choices as IJSONObject[]
            )?.map((choice) => ({
              id: choice.id,
              label: choice.label,
            })),
          })),
        },
        answers: lastResponse.answers?.map((answer: IJSONObject) => ({
          type: answer.type,
          choice: {
            label: (answer?.choice as IJSONObject)?.label,
          },
          field: {
            id: (answer.field as IJSONObject).id,
            ref: (answer.field as IJSONObject).ref,
            type: (answer.field as IJSONObject).type,
          },
        })),
      },
    };

    const dataItem = {
      raw: computedResponseItem,
      meta: {
        internalId: computedResponseItem.form_response.token,
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async registerHook($) {
    const subscriptionPayload = {
      enabled: true,
      url: $.webhookUrl,
      secret: appConfig.appSecretKey,
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
