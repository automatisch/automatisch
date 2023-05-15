import { IRawTrigger } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { GITLAB_EVENT_TYPE } from '../types';
import {
  getRegisterHookFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib';

// confidential_note_events has the same event data as note_events
import data from './note_events';

export const triggerDescriptor: IRawTrigger = {
  name: 'Confidential comment events',
  description:
    'Confidential comment events (triggered when a new confidential comment is made on commits, merge requests, issues, and code snippets)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#comment-events',
  key: GITLAB_EVENT_TYPE.confidential_note_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.confidential_note_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
