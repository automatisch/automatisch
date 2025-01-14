import { generateQueue } from './queue.js';

const removeCancelledSubscriptionsQueue = generateQueue(
  'remove-cancelled-subscriptions',
  { runDaily: true }
);

export default removeCancelledSubscriptionsQueue;
