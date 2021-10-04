import morgan, { StreamOptions } from 'morgan';

import logger from './logger';

const stream: StreamOptions = {
  write: (message) => logger.http(message.substring(0, message.lastIndexOf('\n')))
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);

export default morganMiddleware;
