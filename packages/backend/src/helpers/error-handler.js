import logger from '@/helpers/logger.js';
import objection from 'objection';
const {
  NotFoundError,
  DataError,
  ForeignKeyViolationError,
  ValidationError,
  UniqueViolationError,
} = objection;
import NotAuthorizedError from '@/errors/not-authorized.js';
import QuotaExceededError from '@/errors/quote-exceeded.js';
import HttpError from '@/errors/http.js';
import {
  renderObjectionError,
  renderUniqueViolationError,
} from '@/helpers/renderer.js';
import { McpError } from '@modelcontextprotocol/sdk/types.js';

// Do not remove `next` argument as the function signature will not fit for an error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  if (error.message === 'Not Found' || error instanceof NotFoundError) {
    logger.http(request.method + ' ' + request.url + ' ' + 404);
    response.status(404).end();
    return;
  }

  if (error instanceof QuotaExceededError) {
    logger.http(request.method + ' ' + request.url + ' ' + 422);
    response.status(422).end();
    return;
  }

  if (notFoundAppError(error)) {
    logger.http(request.method + ' ' + request.url + ' ' + 404);
    response.status(404).end();
    return;
  }

  if (error instanceof McpError) {
    response.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: error.code,
        message: error.message,
      },
      id: request.body?.id,
    });
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

  response.status(statusCode).end();
};

const notFoundAppError = (error) => {
  return (
    error.message.includes('An application with the') &&
    error.message.includes("key couldn't be found.")
  );
};

export default errorHandler;
