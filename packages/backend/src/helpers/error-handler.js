import logger from './logger.js';
import objection from 'objection';
const { NotFoundError, DataError } = objection;

// Do not remove `next` argument as the function signature will not fit for an error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  if (error.message === 'Not Found' || error instanceof NotFoundError) {
    response.status(404).end();
  }

  if (notFoundAppError(error)) {
    response.status(404).end();
  }

  if (error instanceof DataError) {
    response.status(400).end();
  }

  logger.error(error.message + '\n' + error.stack);
  response.status(error.statusCode || 500).end();
};

const notFoundAppError = (error) => {
  return (
    error.message.includes('An application with the') ||
    error.message.includes("key couldn't be found.")
  );
};

export default errorHandler;
