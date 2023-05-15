import { URLSearchParams } from 'node:url';
import isEmpty from 'lodash/isEmpty';
import defineTrigger from '../../../../helpers/define-trigger';
import fetchMessages from './fetch-messages';

export default defineTrigger({
  name: 'Receive SMS',
  key: 'receiveSms',
  type: 'webhook',
  description: 'Triggers when a new SMS is received.',
  arguments: [
    {
      label: 'To Number',
      key: 'phoneNumberSid',
      type: 'dropdown' as const,
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
            name: 'valueType',
            value: 'sid',
          }
        ],
      },
    },
  ],

  async testRun($) {
    await fetchMessages($);

    if (!isEmpty($.lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: $.lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        }
      });
    }
  },

  async registerHook($) {
    const phoneNumberSid = $.step.parameters.phoneNumberSid as string;
    const payload = new URLSearchParams({
      SmsUrl: $.webhookUrl,
    }).toString();

    await $.http.post(
      `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/${phoneNumberSid}.json`,
      payload
    );
  },

  async unregisterHook($) {
    const toNumber = $.step.parameters.toNumber as string;
    const payload = new URLSearchParams({
      SmsUrl: '',
    }).toString();

    await $.http.post(
      `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/PN${toNumber}.json`,
      payload
    );
  },
});
