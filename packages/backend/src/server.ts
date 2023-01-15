import type { Server } from 'http';

import app from './app';
import appConfig from './config/app';
import logger from './helpers/logger';
import telemetry from './helpers/telemetry';

telemetry.setServiceType('main');

const server: Server = app.listen(appConfig.port, () => {
  logger.info(`Server is listening on ${appConfig.baseUrl}`);
});

function shutdown(server: Server) {
  server.close();
}

process.on('SIGTERM', () => {
  shutdown(server);
});
