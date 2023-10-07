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

import data from './release_event';

export const triggerDescriptor: IRawTrigger = {
  name: 'Release event',
  description: 'Release event (triggered when a release is created or updated)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#release-events',
  key: GITLAB_EVENT_TYPE.releases_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.releases_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
