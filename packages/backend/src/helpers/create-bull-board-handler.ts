import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import flowQueue from '../queues/flow';
import triggerQueue from '../queues/trigger';
import actionQueue from '../queues/action';
import emailQueue from '../queues/email';
import deleteUserQueue from '../queues/delete-user.ee';
import removeCancelledSubscriptionsQueue from '../queues/remove-cancelled-subscriptions.ee';
import appConfig from '../config/app';

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

const createBullBoardHandler = async (serverAdapter: ExpressAdapter) => {
  if (!shouldEnableBullDashboard) return;

  createBullBoard({
    queues,
    serverAdapter,
  });
};

export { createBullBoardHandler, serverAdapter };
