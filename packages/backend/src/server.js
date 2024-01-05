import app from './app.js';
import appConfig from './config/app.js';
import logger from './helpers/logger.js';
import telemetry from './helpers/telemetry/index.js';

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
