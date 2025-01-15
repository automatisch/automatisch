import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';
import {
  getRegisterHookFn,
  unregisterHook,
} from '../lib.js';

const key = 'convo.note.created' // https://freescout.net/module/api-webhooks/

export const triggerDescriptor = {
  name: 'Note added',
  description: 'Note added',
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
