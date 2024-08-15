import logger from './logger.js';
import objection from 'objection';
import * as Sentry from './sentry.ee.js';
const { NotFoundError, DataError } = objection;
import HttpError from '../errors/http.js';

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

  if (error instanceof HttpError) {
    const httpErrorPayload = {
      errors: JSON.parse(error.message),
      meta: {
        type: 'HttpError',
      },
    };

    response.status(200).json(httpErrorPayload);
  }

  const statusCode = error.statusCode || 500;

  logger.error(request.method + ' ' + request.url + ' ' + statusCode);
  logger.error(error.stack);

  Sentry.captureException(error, {
    tags: { rest: true },
    extra: {
      url: request?.url,
      method: request?.method,
      params: request?.params,
    },
  });

  response.status(statusCode).end();
};

const notFoundAppError = (error) => {
  return (
    error.message.includes('An application with the') &&
    error.message.includes("key couldn't be found.")
  );
};

export default errorHandler;
