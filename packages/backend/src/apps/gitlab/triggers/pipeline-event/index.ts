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

import data from './pipeline_event';

export const triggerDescriptor: IRawTrigger = {
  name: 'Pipeline event',
  description:
    'Pipeline event (triggered when the status of a pipeline changes)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#pipeline-events',
  key: GITLAB_EVENT_TYPE.pipeline_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.pipeline_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
