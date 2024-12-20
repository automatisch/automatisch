import { generateWorker } from './worker.js';
import { removeCancelledSubscriptionsJob } from '../jobs/remove-cancelled-subscriptions.ee.js';

const removeCancelledSubscriptionsWorker = generateWorker(
  'remove-cancelled-subscriptions',
  removeCancelledSubscriptionsJob
);

export default removeCancelledSubscriptionsWorker;
