import { IRawTrigger } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { GITLAB_EVENT_TYPE } from '../types';
import {
  getRegisterHookFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib';

import data from './pipeline_events';

export const triggerDescriptor: IRawTrigger = {
  name: 'Pipeline events',
  description:
    'Pipeline events (triggered when the status of a pipeline changes)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#pipeline-events',
  key: GITLAB_EVENT_TYPE.pipeline_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.pipeline_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
