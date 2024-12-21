import * as Sentry from './helpers/sentry.ee.js';
import process from 'node:process';

Sentry.init();

import './config/orm.js';
import './helpers/check-worker-readiness.js';
import queues from './queues/index.js';
import workers from './workers/index.js';

process.on('SIGTERM', async () => {
  for (const queue of queues) {
    await queue.close();
  }

  for (const worker of workers) {
    await worker.close();
  }
});

import telemetry from './helpers/telemetry/index.js';

telemetry.setServiceType('worker');
