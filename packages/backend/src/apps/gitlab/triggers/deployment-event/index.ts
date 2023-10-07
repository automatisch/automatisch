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

import data from './deployment_event';

export const triggerDescriptor: IRawTrigger = {
  name: 'Deployment event',
  description:
    'Deployment event (triggered when a deployment starts, succeeds, fails or is canceled)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#deployment-events',
  key: GITLAB_EVENT_TYPE.deployment_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.deployment_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
