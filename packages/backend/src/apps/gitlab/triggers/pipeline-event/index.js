import defineTrigger from '../../../../helpers/define-trigger.js';
import { GITLAB_EVENT_TYPE } from '../types.js';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib.js';

import data from './pipeline_event.js';

export const triggerDescriptor = {
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
