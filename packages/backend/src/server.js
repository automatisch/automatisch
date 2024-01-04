import app from './app';
import appConfig from './config/app';
import logger from './helpers/logger';
import telemetry from './helpers/telemetry';

telemetry.setServiceType('main');

const server = app.listen(appConfig.port, () => {
  logger.info(`Server is listening on ${appConfig.baseUrl}`);
});

function shutdown(server) {
  server.close();
}

process.on('SIGTERM', () => {
  shutdown(server);
});
