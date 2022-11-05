import morgan, { StreamOptions } from 'morgan';
import { Request } from 'express';
import logger from './logger';

const stream: StreamOptions = {
  write: (message) =>
    logger.http(message.substring(0, message.lastIndexOf('\n'))),
};

const registerGraphQLToken = () => {
  morgan.token('graphql-query', (req: Request) => {
    if (req.body.query) {
      return `GraphQL ${req.body.query}`;
    }
  });
};

registerGraphQLToken();

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms\n:graphql-query',
  { stream }
);

export default morganMiddleware;
