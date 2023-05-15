import { IRawTrigger } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { GITLAB_EVENT_TYPE } from '../types';
import {
  getRegisterHookFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib';

import data from './issues_events';

export const triggerDescriptor: IRawTrigger = {
  name: 'Issue events',
  description:
    'Issue events (triggered when a new issue is created or an existing issue is updated, closed, or reopened)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#issue-events',
  key: GITLAB_EVENT_TYPE.issues_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.issues_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
