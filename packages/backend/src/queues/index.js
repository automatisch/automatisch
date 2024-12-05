import appConfig from '../config/app.js';
import actionQueue from './action.js';
import emailQueue from './email.js';
import flowQueue from './flow.js';
import triggerQueue from './trigger.js';
import deleteUserQueue from './delete-user.ee.js';
import removeCancelledSubscriptionsQueue from './remove-cancelled-subscriptions.ee.js';

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
