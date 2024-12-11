import appConfig from '../config/app.js';
import actionWorker from './action.js';
import emailWorker from './email.js';
import flowWorker from './flow.js';
import triggerWorker from './trigger.js';
import deleteUserWorker from './delete-user.ee.js';
import removeCancelledSubscriptionsWorker from './remove-cancelled-subscriptions.ee.js';

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
