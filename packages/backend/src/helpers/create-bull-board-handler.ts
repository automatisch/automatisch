import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import flowQueue from '../queues/flow';
import triggerQueue from '../queues/trigger';
import actionQueue from '../queues/action';
import emailQueue from '../queues/email';
import deleteUserQueue from '../queues/delete-user.ee';
import appConfig from '../config/app';

const serverAdapter = new ExpressAdapter();

const createBullBoardHandler = async (serverAdapter: ExpressAdapter) => {
  if (
    !appConfig.enableBullMQDashboard ||
    !appConfig.bullMQDashboardUsername ||
    !appConfig.bullMQDashboardPassword
  )
    return;

  createBullBoard({
    queues: [
      new BullMQAdapter(flowQueue),
      new BullMQAdapter(triggerQueue),
      new BullMQAdapter(actionQueue),
      new BullMQAdapter(emailQueue),
      new BullMQAdapter(deleteUserQueue),
    ],
    serverAdapter: serverAdapter,
  });
};

export { createBullBoardHandler, serverAdapter };
