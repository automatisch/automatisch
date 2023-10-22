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

import data from './merge_request_event';

export const triggerDescriptor: IRawTrigger = {
  name: 'Merge request event',
  description:
    'Merge request event (triggered when merge request is created, updated, or closed)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#merge-request-events',
  key: GITLAB_EVENT_TYPE.merge_requests_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.merge_requests_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
