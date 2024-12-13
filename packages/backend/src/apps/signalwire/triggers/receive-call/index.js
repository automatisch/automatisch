import { URLSearchParams } from 'node:url';
import Crypto from 'node:crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Receive Call',
  key: 'receiveCall',
  workSynchronously: true,
  type: 'webhook',
  description: 'Triggers when a new call is received.',
  arguments: [
    {
      label: 'To Number',
      key: 'phoneNumberSid',
      type: 'dropdown',
      required: true,
      description:
        'The number to receive the call on. It should be a SignalWire number in your project.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listIncomingCallPhoneNumbers',
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
    const phoneNumberSid = $.step.parameters.phoneNumberSid;

    const payload = new URLSearchParams({
      VoiceUrl: $.webhookUrl,
    }).toString();

    await $.http.post(
      `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/${phoneNumberSid}.json`,
      payload
    );
  },

  async unregisterHook($) {
    const phoneNumberSid = $.step.parameters.phoneNumberSid;

    const payload = new URLSearchParams({
      VoiceUrl: '',
    }).toString();

    await $.http.post(
      `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/${phoneNumberSid}.json`,
      payload
    );
  },
});
