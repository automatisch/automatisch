import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import flowQueue from '../queues/flow.js';
import triggerQueue from '../queues/trigger.js';
import actionQueue from '../queues/action.js';
import emailQueue from '../queues/email.js';
import deleteUserQueue from '../queues/delete-user.ee.js';
import removeCancelledSubscriptionsQueue from '../queues/remove-cancelled-subscriptions.ee.js';
import appConfig from '../config/app.js';

const serverAdapter = new ExpressAdapter();

const queues = [
  new BullMQAdapter(flowQueue),
  new BullMQAdapter(triggerQueue),
  new BullMQAdapter(actionQueue),
  new BullMQAdapter(emailQueue),
  new BullMQAdapter(deleteUserQueue),
];

if (appConfig.isCloud) {
  queues.push(new BullMQAdapter(removeCancelledSubscriptionsQueue));
}

const shouldEnableBullDashboard = () => {
  return (
    appConfig.enableBullMQDashboard &&
    appConfig.bullMQDashboardUsername &&
    appConfig.bullMQDashboardPassword
  );
};

const createBullBoardHandler = async (serverAdapter) => {
  if (!shouldEnableBullDashboard) return;

  createBullBoard({
    queues,
    serverAdapter,
  });
};

export { createBullBoardHandler, serverAdapter };
