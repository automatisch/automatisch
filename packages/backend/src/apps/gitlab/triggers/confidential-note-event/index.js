import defineTrigger from '../../../../helpers/define-trigger.js';
import { GITLAB_EVENT_TYPE } from '../types.js';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib.js';

// confidential_note_events has the same event data as note_events
import data from './note_event.js';

export const triggerDescriptor = {
  name: 'Confidential comment event',
  description:
    'Confidential comment event (triggered when a new confidential comment is made on commits, merge requests, issues, and code snippets)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#comment-events',
  key: GITLAB_EVENT_TYPE.confidential_note_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.confidential_note_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
