import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';
import {
  getRegisterHookFn,
  unregisterHook,
} from '../lib.js';

const key = 'convo.customer.reply.created' // https://freescout.net/module/api-webhooks/

export const triggerDescriptor = {
  name: 'Customer replied',
  description: 'Customer replied',
  key,
  type: 'webhook',
  registerHook: getRegisterHookFn(key),
  unregisterHook,
  async testRun($) {
    $.pushTriggerItem({
      meta: {
          internalId: Crypto.randomUUID(),
      },
      raw: { // https://api-docs.freescout.net/#...
        key
      }       
    });
  },
};

export default defineTrigger(triggerDescriptor);
