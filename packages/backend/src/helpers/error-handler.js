import logger from './logger.js';

// Do not remove `next` argument as the function signature will not fit for an error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.message === 'Not Found') {
    res.status(404).end();
  } else {
    logger.error(err.message + '\n' + err.stack);
    res.status(err.statusCode || 500).send(err.message);
  }
};

export default errorHandler;
