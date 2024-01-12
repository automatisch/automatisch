import defineTrigger from '../../../../helpers/define-trigger.js';
import { GITLAB_EVENT_TYPE } from '../types.js';
import {
  getRegisterHookFn,
  getRunFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib.js';

import data from './wiki_page_event.js';

export const triggerDescriptor = {
  name: 'Wiki page event',
  description:
    'Wiki page event (triggered when a wiki page is created, updated, or deleted)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#wiki-page-events',
  key: GITLAB_EVENT_TYPE.wiki_page_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  run: ($) => getRunFn($),
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.wiki_page_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
