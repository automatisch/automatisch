import basicAuth from 'express-basic-auth';
import appConfig from '../config/app.js';

const injectBullBoardHandler = async (app, serverAdapter) => {
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
