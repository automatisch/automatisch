import * as Sentry from './helpers/sentry.ee';
import appConfig from './config/app';

Sentry.init();

import './config/orm';
import './helpers/check-worker-readiness';
import './workers/flow';
import './workers/trigger';
import './workers/action';
import './workers/email';
import './workers/delete-user.ee';

if (appConfig.isCloud) {
  import('./workers/remove-cancelled-subscriptions.ee');
  import('./queues/remove-cancelled-subscriptions.ee');
}

import telemetry from './helpers/telemetry';

telemetry.setServiceType('worker');
