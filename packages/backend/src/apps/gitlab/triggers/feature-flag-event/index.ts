import { IRawTrigger } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { GITLAB_EVENT_TYPE } from '../types';
import {
  getRegisterHookFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib';

import data from './feature_flag_events';

export const triggerDescriptor: IRawTrigger = {
  name: 'Feature flag events',
  description:
    'Feature flag events (triggered when a feature flag is turned on or off)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#feature-flag-events',
  key: GITLAB_EVENT_TYPE.feature_flag_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.feature_flag_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
