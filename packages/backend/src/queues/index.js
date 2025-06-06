import appConfig from '@/config/app.js';
import actionQueue from '@/queues/action.js';
import emailQueue from '@/queues/email.js';
import flowQueue from '@/queues/flow.js';
import triggerQueue from '@/queues/trigger.js';
import deleteUserQueue from '@/queues/delete-user.ee.js';
import removeCancelledSubscriptionsQueue from '@/queues/remove-cancelled-subscriptions.ee.js';

const queues = [
  actionQueue,
  emailQueue,
  flowQueue,
  triggerQueue,
  deleteUserQueue,
];

if (appConfig.isCloud) {
  queues.push(removeCancelledSubscriptionsQueue);
}

export default queues;
