import defineTrigger from '../../../../helpers/define-trigger.js';
import { GITLAB_EVENT_TYPE } from '../types.js';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib.js';

import data from './job_event.js';

export const triggerDescriptor = {
  name: 'Job event',
  description: 'Job event (triggered when the status of a job changes)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#job-events',
  key: GITLAB_EVENT_TYPE.job_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.job_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
