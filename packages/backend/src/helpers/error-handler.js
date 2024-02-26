import logger from './logger.js';

// Do not remove `next` argument as the function signature will not fit for an error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  if (error.message === 'Not Found' || error.message === 'NotFoundError') {
    response.status(404).end();
  } else {
    logger.error(error.message + '\n' + error.stack);
    response.status(error.statusCode || 500);
  }
};

export default errorHandler;
