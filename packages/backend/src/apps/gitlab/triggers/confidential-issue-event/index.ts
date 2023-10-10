import { IRawTrigger } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { GITLAB_EVENT_TYPE } from '../types';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib';

// confidential_issues_events has the same event data as issues_events
import data from './issue_event';

export const triggerDescriptor: IRawTrigger = {
  name: 'Confidential issue event',
  description:
    'Confidential issue event (triggered when a new confidential issue is created or an existing issue is updated, closed, or reopened)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#issue-events',
  key: GITLAB_EVENT_TYPE.confidential_issues_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.confidential_issues_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
