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

import data from './tag_push_event';

export const triggerDescriptor: IRawTrigger = {
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
