import { generateQueue } from '@/queues/queue.js';

const removeCancelledSubscriptionsQueue = generateQueue(
  'remove-cancelled-subscriptions',
  { runDaily: true }
);

export default removeCancelledSubscriptionsQueue;
