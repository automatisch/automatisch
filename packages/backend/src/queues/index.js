import appConfig from '@/config/app.js';
import emailQueue from '@/queues/email.js';
import flowQueue from '@/queues/flow.js';
import deleteUserQueue from '@/queues/delete-user.ee.js';
import removeCancelledSubscriptionsQueue from '@/queues/remove-cancelled-subscriptions.ee.js';

const queues = [emailQueue, flowQueue, deleteUserQueue];

if (appConfig.isCloud) {
  queues.push(removeCancelledSubscriptionsQueue);
}

export default queues;
