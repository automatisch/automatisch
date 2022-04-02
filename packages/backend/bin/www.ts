import app from '../src/app';
import appConfig from '../src/config/app';
import logger from '../src/helpers/logger';

const port = appConfig.port;

app.listen(port, () => {
  logger.info(`Server is listening on ${port}`);
});