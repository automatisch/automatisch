import morgan from 'morgan';
import logger from './logger.js';

const stream = {
  write: (message) =>
    logger.http(message.substring(0, message.lastIndexOf('\n'))),
};

const registerGraphQLToken = () => {
  morgan.token('graphql-query', (req) => {
    if (req.body.query) {
      return `\n GraphQL ${req.body.query}`;
    }
  });
};

registerGraphQLToken();

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms :graphql-query',
  { stream }
);

export default morganMiddleware;
