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

import data from './push_event';

export const branchFilterStrategyArgumentDescriptor = {
  label: 'What type of filter to use?',
  key: 'branch_filter_strategy',
  type: 'dropdown' as const,
  description: 'Defaults to including all branches',
  required: true,
  variables: false,
  value: 'all_branches',
  options: [
    {
      label: 'All branches',
      value: 'all_branches',
    },
    {
      label: 'Wildcard pattern (ex: *-stable)',
      value: 'wildcard',
    },
    {
      label: 'Regular expression (ex: ^(feature|hotfix)/)',
      value: 'regex',
    },
  ],
};

export const pushEventsBranchFilterArgumentDescriptor = {
  label: 'Filter value',
  key: 'push_events_branch_filter',
  description: 'Leave empty when using "all branches"',
  type: 'string' as const,
  required: false,
  variables: false,
};

export const triggerDescriptor: IRawTrigger = {
  name: 'Push event',
  description: 'Push event (triggered when you push to the repository)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#push-events',
  key: GITLAB_EVENT_TYPE.push_events,
  type: 'webhook',
  arguments: [
    projectArgumentDescriptor,
    branchFilterStrategyArgumentDescriptor,
    pushEventsBranchFilterArgumentDescriptor,
  ],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.push_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
