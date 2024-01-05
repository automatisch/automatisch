import defineTrigger from '../../../../helpers/define-trigger.js';
import { GITLAB_EVENT_TYPE } from '../types.js';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib.js';

import data from './tag_push_event.js';

export const triggerDescriptor = {
  name: 'Tag event',
  description:
    'Tag event (triggered when you create or delete tags in the repository)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#tag-events',
  key: GITLAB_EVENT_TYPE.tag_push_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.tag_push_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
