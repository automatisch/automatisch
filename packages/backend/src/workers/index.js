import appConfig from '@/config/app.js';
import actionWorker from '@/workers/action.js';
import emailWorker from '@/workers/email.js';
import flowWorker from '@/workers/flow.js';
import triggerWorker from '@/workers/trigger.js';
import deleteUserWorker from '@/workers/delete-user.ee.js';
import removeCancelledSubscriptionsWorker from '@/workers/remove-cancelled-subscriptions.ee.js';

const workers = [
  actionWorker,
  emailWorker,
  flowWorker,
  triggerWorker,
  deleteUserWorker,
];

if (appConfig.isCloud) {
  workers.push(removeCancelledSubscriptionsWorker);
}

export default workers;
