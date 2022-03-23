import { Application } from 'express';
import { ExpressAdapter } from '@bull-board/express';

const injectBullBoardHandler = async (
  app: Application,
  serverAdapter: ExpressAdapter
) => {
  const queueDashboardBasePath = '/admin/queues';
  serverAdapter.setBasePath(queueDashboardBasePath);
  app.use(queueDashboardBasePath, serverAdapter.getRouter());
};

export default injectBullBoardHandler;
