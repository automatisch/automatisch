import { IRawTrigger } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { GITLAB_EVENT_TYPE } from '../types';
import {
  getRegisterHookFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib';

import data from './deployment_events';

export const triggerDescriptor: IRawTrigger = {
  name: 'Deployment events',
  description:
    'Deployment events (triggered when a deployment starts, succeeds, fails or is canceled)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#deployment-events',
  key: GITLAB_EVENT_TYPE.deployment_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.deployment_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
