import * as Sentry from './helpers/sentry.ee.js';
import appConfig from './config/app.js';

Sentry.init();

import './config/orm.js';
import './helpers/check-worker-readiness.js';
import './workers/flow.js';
import './workers/trigger.js';
import './workers/action.js';
import './workers/email.js';
import './workers/delete-user.ee.js';

if (appConfig.isCloud) {
  import('./workers/remove-cancelled-subscriptions.ee.js');
  import('./queues/remove-cancelled-subscriptions.ee.js');
}

import telemetry from './helpers/telemetry/index.js';

telemetry.setServiceType('worker');
