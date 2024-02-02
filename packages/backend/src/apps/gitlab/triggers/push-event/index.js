import defineTrigger from '../../../../helpers/define-trigger.js';
import { GITLAB_EVENT_TYPE } from '../types.js';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib.js';

import data from './push_event.js';

export const branchFilterStrategyArgumentDescriptor = {
  label: 'What type of filter to use?',
  key: 'branch_filter_strategy',
  type: 'dropdown',
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
  type: 'string',
  required: false,
  variables: false,
};

export const triggerDescriptor = {
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
