import app from './app';
import appConfig from './config/app';
import logger from './helpers/logger';

const port = appConfig.port;

app.listen(port, () => {
  logger.info(`Server is listening on ${port}`);
});