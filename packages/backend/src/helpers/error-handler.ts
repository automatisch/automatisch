import { NextFunction, Request, Response } from 'express';
import logger from './logger';

import BaseError from '../errors/base';

// Do not remove `next` argument as the function signature will not fit for an error handler middleware
const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.message === 'Not Found') {
    res.status(404).end();
  } else {
    logger.error(err.message + '\n' + err.stack);
    res.status(err.statusCode || 500).send(err.message);
  }
};

export default errorHandler;
