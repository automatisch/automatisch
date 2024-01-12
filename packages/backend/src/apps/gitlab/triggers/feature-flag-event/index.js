import defineTrigger from '../../../../helpers/define-trigger.js';
import { GITLAB_EVENT_TYPE } from '../types.js';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib.js';

import data from './feature_flag_event.js';

export const triggerDescriptor = {
  name: 'Feature flag event',
  description:
    'Feature flag event (triggered when a feature flag is turned on or off)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#feature-flag-events',
  key: GITLAB_EVENT_TYPE.feature_flag_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.feature_flag_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
