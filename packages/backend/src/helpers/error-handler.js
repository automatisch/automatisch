import logger from './logger.js';
import objection from 'objection';
import * as Sentry from './sentry.ee.js';
const {
  NotFoundError,
  DataError,
  ForeignKeyViolationError,
  ValidationError,
  UniqueViolationError,
} = objection;
import NotAuthorizedError from '../errors/not-authorized.js';
import HttpError from '../errors/http.js';
import {
  renderObjectionError,
  renderUniqueViolationError,
} from './renderer.js';

// Do not remove `next` argument as the function signature will not fit for an error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  if (error.message === 'Not Found' || error instanceof NotFoundError) {
    logger.http(request.method + ' ' + request.url + ' ' + 404);
    response.status(404).end();
    return;
  }

  if (notFoundAppError(error)) {
    logger.http(request.method + ' ' + request.url + ' ' + 404);
    response.status(404).end();
    return;
  }

  if (error instanceof ValidationError) {
    logger.http(request.method + ' ' + request.url + ' ' + 422);
    renderObjectionError(response, error, 422);
    return;
  }

  if (error instanceof UniqueViolationError) {
    renderUniqueViolationError(response, error);
    return;
  }

  if (error instanceof ForeignKeyViolationError) {
    response.status(500).end();
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

    response.status(422).json(httpErrorPayload);
  }

  if (error instanceof NotAuthorizedError) {
    response.status(403).end();
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
