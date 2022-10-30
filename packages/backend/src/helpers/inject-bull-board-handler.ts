import { Application } from 'express';
import { ExpressAdapter } from '@bull-board/express';
import basicAuth from 'express-basic-auth';
import appConfig from '../config/app';

const injectBullBoardHandler = async (
  app: Application,
  serverAdapter: ExpressAdapter
) => {
  if (
    !appConfig.enableBullMQDashboard ||
    !appConfig.bullMQDashboardUsername ||
    !appConfig.bullMQDashboardPassword
  )
    return;

  const queueDashboardBasePath = '/admin/queues';
  serverAdapter.setBasePath(queueDashboardBasePath);

  app.use(
    queueDashboardBasePath,
    basicAuth({
      users: {
        [appConfig.bullMQDashboardUsername]: appConfig.bullMQDashboardPassword,
      },
      challenge: true,
    }),
    serverAdapter.getRouter()
  );
};

export default injectBullBoardHandler;
