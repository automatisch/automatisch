import { URLSearchParams } from 'node:url';
import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';
import fetchMessages from './fetch-messages.js';

export default defineTrigger({
  name: 'Receive SMS',
  key: 'receiveSms',
  type: 'webhook',
  description: 'Triggers when a new SMS is received.',
  arguments: [
    {
      label: 'To Number',
      key: 'phoneNumberSid',
      type: 'dropdown',
      required: true,
      description:
        'The number to receive the SMS on. It should be a Twilio number.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listIncomingPhoneNumbers',
          },
          {
            name: 'parameters.valueType',
            value: 'sid',
          },
        ],
      },
    },
  ],

  useSingletonWebhook: true,
  singletonWebhookRefValueParameter: 'phoneNumberSid',

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
    await fetchMessages($);

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
    const phoneNumberSid = $.step.parameters.phoneNumberSid;
    const payload = new URLSearchParams({
      SmsUrl: $.webhookUrl,
    }).toString();

    await $.http.post(
      `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/${phoneNumberSid}.json`,
      payload
    );
  },

  async unregisterHook($) {
    const phoneNumberSid = $.step.parameters.phoneNumberSid;
    const payload = new URLSearchParams({
      SmsUrl: '',
    }).toString();

    await $.http.post(
      `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/${phoneNumberSid}.json`,
      payload
    );
  },
});
